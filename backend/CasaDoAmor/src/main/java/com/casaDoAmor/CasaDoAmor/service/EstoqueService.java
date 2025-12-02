package com.casaDoAmor.CasaDoAmor.service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.casaDoAmor.CasaDoAmor.dtoCriar.DespachoDTOCriar;
import com.casaDoAmor.CasaDoAmor.dtoCriar.EstoqueDTOCriar;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;

@Service
public class EstoqueService {
    private final EstoqueRepository estoqueRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final HistoricoService historicoService;
    private final NotificacaoService notificacaoService;

    public EstoqueService(EstoqueRepository estoqueRepository,
            MedicamentoRepository medicamentoRepository,
            HistoricoService historicoService,
            NotificacaoService notificacaoService) {
        this.estoqueRepository = estoqueRepository;
        this.medicamentoRepository = medicamentoRepository;
        this.historicoService = historicoService;
        this.notificacaoService = notificacaoService;
    }

    @Transactional
    public Estoque salvar(EstoqueDTOCriar dto) {
        UUID medicamentoId = dto.getMedicamentoId();
        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
                .orElseThrow(() -> new RuntimeException("Medicamento não encontrado com ID: " + medicamentoId));

        long saldoAtualTotal = medicamento.getEstoques().stream()
                .mapToLong(Estoque::getQuantidade)
                .sum();

        long novoSaldoTotal = saldoAtualTotal + dto.getQuantidade();
        long estoqueMaximo = medicamento.getEstoqueMaximo();

        if (novoSaldoTotal > estoqueMaximo) {
            throw new RuntimeException("ENTRADA INVÁLIDA: O estoque total ultrapassa o limite máximo.");
        }

        Optional<Estoque> loteExistente = medicamento.getEstoques().stream()
                .filter(e -> e.getLote().equalsIgnoreCase(dto.getLote()) &&
                        ((e.getValidadeAposAberto() == null && dto.getValidadeAposAberto() == null) ||
                                (e.getValidadeAposAberto() != null
                                        && e.getValidadeAposAberto().equals(dto.getValidadeAposAberto()))))
                .findFirst();

        Estoque estoqueSalvo;

        if (loteExistente.isPresent()) {
            Estoque estoque = loteExistente.get();
            estoque.setQuantidade(estoque.getQuantidade() + dto.getQuantidade());
            estoqueSalvo = estoqueRepository.save(estoque);
        } else {
            Estoque novoEstoque = new Estoque();
            novoEstoque.setQuantidade(dto.getQuantidade());
            novoEstoque.setStatus(dto.getStatus());
            novoEstoque.setLote(dto.getLote());
            novoEstoque.setValidadeAposAberto(dto.getValidadeAposAberto());

            novoEstoque.setMedicamento(medicamento);
            medicamento.getEstoques().add(novoEstoque);

            estoqueSalvo = estoqueRepository.save(novoEstoque);
        }

        // Histórico de Entrada (Destinatário null)
        historicoService.registrar(
                "ENTRADA",
                medicamento.getNome(),
                "Sistema",
                "Entrada de " + dto.getQuantidade() + "un. Lote: " + dto.getLote(),
                null);

        // Verificações de notificações após entrada de estoque
        notificacaoService.verificarMedicamentosCriticos();
        notificacaoService.verificarMedicamentosVencidos();
        notificacaoService.verificarMedicamentosProximosVencimento();

        return estoqueSalvo;
    }

    @Transactional
    public void deletar(Estoque estoque) {
        estoqueRepository.delete(estoque);
    }

    @Transactional
    public List<Estoque> listarTodos() {
        return estoqueRepository.findAll();
    }

    @Transactional
    public void realizarDespacho(DespachoDTOCriar dados) {
        Medicamento medicamento = medicamentoRepository.findById(dados.medicamentoId())
                .orElseThrow(() -> new RuntimeException("Medicamento não encontrado."));

        List<Estoque> lotes = medicamento.getEstoques();
        long saldoTotal = lotes.stream().mapToLong(Estoque::getQuantidade).sum();
        int quantidadeDesejada = dados.quantidade();

        if (saldoTotal < quantidadeDesejada) {
            throw new RuntimeException("Estoque insuficiente!");
        }

        // Registrar Histórico de Saída (Com Destinatário)
        String nomePaciente = StringUtils.hasText(dados.paciente()) ? dados.paciente() : "Não informado";
        String obs = StringUtils.hasText(dados.observacao()) ? dados.observacao() : "Sem observação";

        historicoService.registrar(
                "SAIDA",
                medicamento.getNome(),
                "Sistema",
                "Despacho de " + dados.quantidade() + "un. Obs: " + obs,
                nomePaciente);

        long faltaRemover = quantidadeDesejada;
        Iterator<Estoque> iterator = lotes.iterator();

        while (iterator.hasNext() && faltaRemover > 0) {
            Estoque loteAtual = iterator.next();
            long qtdNoLote = loteAtual.getQuantidade();

            if (qtdNoLote <= faltaRemover) {
                faltaRemover -= qtdNoLote;
                estoqueRepository.delete(loteAtual);
                iterator.remove();
            } else {
                loteAtual.setQuantidade(qtdNoLote - faltaRemover);
                faltaRemover = 0;
                estoqueRepository.save(loteAtual);
            }
        }

        if (medicamento.getEstoques().isEmpty()) {
            historicoService.registrar(
                    "SISTEMA",
                    medicamento.getNome(),
                    "Automático",
                    "Medicamento removido do cadastro pois o estoque zerou.",
                    null);
            medicamentoRepository.delete(medicamento);
        } else {
            medicamentoRepository.save(medicamento);
            // Verificações de notificações após despacho
            notificacaoService.verificarMedicamentosCriticos();
            notificacaoService.verificarMedicamentosVencidos();
            notificacaoService.verificarMedicamentosProximosVencimento();
        }
    }
}