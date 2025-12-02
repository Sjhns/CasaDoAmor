package com.casaDoAmor.CasaDoAmor.service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public EstoqueService(EstoqueRepository estoqueRepository, MedicamentoRepository medicamentoRepository) {
        this.estoqueRepository = estoqueRepository;
        this.medicamentoRepository = medicamentoRepository;
    }

    // --- CORREÇÃO DE INCONSISTENCIAS (ADIÇÃO SEGURA) ---
    @Transactional
    public Estoque salvar(EstoqueDTOCriar dto) { 
        UUID medicamentoId = dto.getMedicamentoId();
        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
             .orElseThrow(() -> new RuntimeException("Medicamento não encontrado com ID: " + medicamentoId));
        
        // 1. Validar Teto Máximo
        long saldoAtualTotal = medicamento.getEstoques().stream()
            .mapToLong(Estoque::getQuantidade)
            .sum();
        
        long novoSaldoTotal = saldoAtualTotal + dto.getQuantidade();
        long estoqueMaximo = medicamento.getEstoqueMaximo();
        
        if (novoSaldoTotal > estoqueMaximo) {
            throw new RuntimeException("ENTRADA INVÁLIDA: O estoque total (" + novoSaldoTotal + ") ultrapassa o limite máximo (" + estoqueMaximo + ").");
        }

        // 2. Lógica de Agrupamento Específico:
        // Só soma se for EXATAMENTE o mesmo Lote E a mesma Validade.
        // Caso contrário, cria uma linha separada.
        Optional<Estoque> estoqueIdentico = medicamento.getEstoques().stream()
            .filter(e -> 
                e.getLote().equalsIgnoreCase(dto.getLote()) && 
                ( // Compara datas lidando com nulos
                    (e.getValidadeAposAberto() == null && dto.getValidadeAposAberto() == null) ||
                    (e.getValidadeAposAberto() != null && e.getValidadeAposAberto().equals(dto.getValidadeAposAberto()))
                )
            )
            .findFirst();

        if (estoqueIdentico.isPresent()) {
            // Se é tudo idêntico (Lote E Validade), apenas soma a quantidade.
            Estoque estoque = estoqueIdentico.get();
            estoque.setQuantidade(estoque.getQuantidade() + dto.getQuantidade());
            return estoqueRepository.save(estoque);
        } else {
            // Se mudou o lote OU a validade, cria um registro novo (Nova linha na tabela).
            Estoque novoEstoque = new Estoque();
            novoEstoque.setQuantidade(dto.getQuantidade());
            novoEstoque.setStatus(dto.getStatus());
            novoEstoque.setLote(dto.getLote());
            novoEstoque.setValidadeAposAberto(dto.getValidadeAposAberto()); // A data diferente fica salva aqui
            
            novoEstoque.setMedicamento(medicamento);
            medicamento.getEstoques().add(novoEstoque);
            
            return estoqueRepository.save(novoEstoque);
        }
    }

    @Transactional
    public void deletar(Estoque estoque) {
        estoqueRepository.delete(estoque);
    }
    
    @Transactional
    public List<Estoque> listarTodos() {
        return estoqueRepository.findAll();
    }

    // --- SUA LÓGICA DE DESPACHO (Mantendo a remoção do medicamento se zerar) ---
    @Transactional
    public void realizarDespacho(DespachoDTOCriar dados) {
        Medicamento medicamento = medicamentoRepository.findById(dados.medicamentoId())
                .orElseThrow(() -> new RuntimeException("Medicamento não encontrado para este ID."));

        List<Estoque> lotes = medicamento.getEstoques();

        long saldoTotal = lotes.stream().mapToLong(Estoque::getQuantidade).sum();
        int quantidadeDesejada = dados.quantidade();

        if (saldoTotal < quantidadeDesejada) {
            throw new RuntimeException("Estoque insuficiente! Total disponível: " + saldoTotal);
        }

        // Lógica FIFO (Consome lote a lote)
        long faltaRemover = quantidadeDesejada;
        Iterator<Estoque> iterator = lotes.iterator();
        
        while (iterator.hasNext() && faltaRemover > 0) {
            Estoque loteAtual = iterator.next();
            long qtdNoLote = loteAtual.getQuantidade();

            if (qtdNoLote <= faltaRemover) {
                // Esvaziou o lote
                faltaRemover -= qtdNoLote;
                estoqueRepository.delete(loteAtual);
                iterator.remove(); 
            } else {
                // Sobrou no lote
                loteAtual.setQuantidade(qtdNoLote - faltaRemover);
                faltaRemover = 0;
                estoqueRepository.save(loteAtual);
            }
        }
        
        // Se acabou tudo, deleta o cadastro do remédio.
        if (medicamento.getEstoques().isEmpty()) {
            medicamentoRepository.delete(medicamento);
        } else {
            medicamentoRepository.save(medicamento);
        }
    }
}