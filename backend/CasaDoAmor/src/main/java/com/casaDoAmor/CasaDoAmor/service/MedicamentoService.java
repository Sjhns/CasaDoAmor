package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casaDoAmor.CasaDoAmor.dtoAtualizar.MedicamentoDTOAtualizar;
import com.casaDoAmor.CasaDoAmor.dtoAtualizar.MovimentarEstoqueDTOAtualizar;
import com.casaDoAmor.CasaDoAmor.dtoCriar.MedicamentoDTOCriar;
import com.casaDoAmor.CasaDoAmor.dtoListar.MedicamentoEstoqueDTOListar;
import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.paginacao.PageResposta;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;
import com.casaDoAmor.CasaDoAmor.specification.MedicamentoSpecification;

@Service
public class MedicamentoService {
    private final MedicamentoRepository medicamentoRepository;
    private final EstoqueRepository estoqueRepository;
    private final DenominacaoGenericaService denominacaoGenericaService;
    private final HistoricoService historicoService; // <--- Serviço injetado para logs

    public MedicamentoService(MedicamentoRepository medicamentoRepository, 
                              EstoqueRepository estoqueRepository,
                              DenominacaoGenericaService denominacaoGenericaService,
                              HistoricoService historicoService) {
        this.medicamentoRepository = medicamentoRepository;
        this.estoqueRepository = estoqueRepository;
        this.denominacaoGenericaService = denominacaoGenericaService;
        this.historicoService = historicoService;
    }

    @Transactional(readOnly = true)
    public PageResposta<MedicamentoEstoqueDTOListar> listarPaginado(
            int page,
            int perPage,
            String search,
            String sortBy,
            String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page - 1, perPage, sort);
        Specification<Medicamento> spec = MedicamentoSpecification.buscarPorTermo(search);
        Page<Medicamento> pageEntidades = medicamentoRepository.findAll(spec, pageable);
        List<MedicamentoEstoqueDTOListar> dtos = pageEntidades.getContent().stream()
                .map(MedicamentoEstoqueDTOListar::fromEntity)
                .collect(Collectors.toList());
        PageResposta<MedicamentoEstoqueDTOListar> response = new PageResposta<>(
                pageEntidades.getTotalElements(),
                pageEntidades.getNumber() + 1,
                pageEntidades.getSize(),
                dtos);
        return response;
    }

    @Transactional
    public Medicamento salvar(MedicamentoDTOCriar dto) {
        Medicamento entidade = new Medicamento();
        DenominacaoGenerica denominacaoGenerica = denominacaoGenericaService.buscarPorId(dto.getDenominacaoGenericaId())
                .orElseThrow(() -> new RuntimeException("Denominação Genérica não encontrada para o ID fornecido."));
        entidade.setDenominacaoGenerica(denominacaoGenerica);
        entidade.setNome(dto.getNome());
        entidade.setFormaFarmaceutica(dto.getFormaFarmaceutica());
        entidade.setViaDeAdministracao(dto.getViaDeAdministracao());
        entidade.setConcentracao(dto.getConcentracao());
        entidade.setCategoriaTerapeutica(dto.getCategoriaTerapeutica());
        entidade.setLaboratorioFabricante(dto.getLaboratorioFabricante());
        entidade.setEstoqueMinimo(dto.getEstoqueMinimo());
        entidade.setEstoqueMaximo(dto.getEstoqueMaximo());

        Medicamento salvo = medicamentoRepository.save(entidade);

        // --- LOG DE CADASTRO ---
        historicoService.registrar(
            "CADASTRO", 
            salvo.getNome(), 
            "Sistema", 
            "Novo medicamento cadastrado no sistema.", 
            null
        );

        return salvo;
    }

    @Transactional
    public void deletar(Medicamento medicamento) {
        // --- LOG DE EXCLUSÃO ---
        historicoService.registrar(
            "EXCLUSAO", 
            medicamento.getNome(), 
            "Sistema", 
            "Medicamento excluído manualmente.", 
            null
        );
        medicamentoRepository.delete(medicamento);
    }

    @Transactional
    public List<Medicamento> listarTodos() {
        return medicamentoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Medicamento buscarPorId(UUID id) {
        return medicamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ERRO 404: Medicamento não encontrado para o ID: " + id));
    }

    @Transactional
    public Medicamento atualizar(UUID id, MedicamentoDTOAtualizar dto) {
        Medicamento entidade = medicamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ERRO 404: Medicamento não encontrado para o ID: " + id));

        if (dto.getDenominacaoGenericaId() != null) {
            DenominacaoGenerica denominacaoGenerica = denominacaoGenericaService
                    .buscarPorId(dto.getDenominacaoGenericaId())
                    .orElseThrow(
                            () -> new RuntimeException("Denominação Genérica não encontrada para o ID fornecido."));
            entidade.setDenominacaoGenerica(denominacaoGenerica);
        }

        entidade.setNome(dto.getNome());
        entidade.setFormaFarmaceutica(dto.getFormaFarmaceutica());
        entidade.setViaDeAdministracao(dto.getViaDeAdministracao());
        entidade.setConcentracao(dto.getConcentracao());
        entidade.setCategoriaTerapeutica(dto.getCategoriaTerapeutica());
        entidade.setLaboratorioFabricante(dto.getLaboratorioFabricante());
        entidade.setEstoqueMinimo(dto.getEstoqueMinimo());
        entidade.setEstoqueMaximo(dto.getEstoqueMaximo());

        Medicamento atualizado = medicamentoRepository.save(entidade);

        // --- LOG DE EDIÇÃO ---
        historicoService.registrar(
            "EDICAO", 
            atualizado.getNome(), 
            "Sistema", 
            "Dados cadastrais do medicamento foram alterados.", 
            null
        );

        return atualizado;
    }

    // Método legado de movimentação (se ainda estiver em uso pelo Controller antigo)
    @Transactional
    public Estoque movimentarEstoque(UUID estoqueId, MovimentarEstoqueDTOAtualizar dto) {
        Estoque unidadeEstoque = estoqueRepository.findById(estoqueId)
                .orElseThrow(
                        () -> new RuntimeException("ERRO 404: Lote de Estoque não encontrado para o ID: " + estoqueId));
        Medicamento medicamento = unidadeEstoque.getMedicamento();
        long estoqueMinimo = medicamento.getEstoqueMinimo();
        long estoqueMaximo = medicamento.getEstoqueMaximo();
        long quantidadeMovimentada = dto.getQuantidade();

        if (quantidadeMovimentada <= 0) {
            throw new RuntimeException("ERRO 400: A quantidade a ser movimentada deve ser maior que zero.");
        }
        long quantidadeAtualUnidadeEstoque = unidadeEstoque.getQuantidade();
        long saldoAtualTotal = medicamento.getEstoques().stream()
                .mapToLong(Estoque::getQuantidade)
                .sum();
        long novoSaldoUnidadeEstoque;
        long novoSaldoTotal;
        switch (dto.getTipo().toUpperCase()) {
            case "ENTRADA":
                novoSaldoUnidadeEstoque = quantidadeAtualUnidadeEstoque + quantidadeMovimentada;
                novoSaldoTotal = saldoAtualTotal + quantidadeMovimentada;
                if (novoSaldoTotal > estoqueMaximo) {
                    throw new RuntimeException("ENTRADA INVÁLIDA: O saldo TOTAL (" + novoSaldoTotal
                            + ") ultrapassa o estoque máximo (" + estoqueMaximo + ").");
                }
                unidadeEstoque.setQuantidade(novoSaldoUnidadeEstoque);
                
                // LOG DE ENTRADA LEGADO
                historicoService.registrar("ENTRADA", medicamento.getNome(), "Sistema", "Entrada manual (legado): " + quantidadeMovimentada, null);
                
                break;
            case "SAIDA":
                novoSaldoUnidadeEstoque = quantidadeAtualUnidadeEstoque - quantidadeMovimentada;
                novoSaldoTotal = saldoAtualTotal - quantidadeMovimentada;

                if (novoSaldoUnidadeEstoque < 0) {
                    throw new RuntimeException("SAÍDA INVÁLIDA: Quantidade insuficiente no Lote.");
                }
                if (novoSaldoTotal < estoqueMinimo) {
                    throw new RuntimeException("SAÍDA INVÁLIDA: O saldo TOTAL (" + novoSaldoTotal
                            + ") é inferior ao estoque mínimo (" + estoqueMinimo + ").");
                }
                
                // LOG DE SAÍDA LEGADO
                historicoService.registrar("SAIDA", medicamento.getNome(), "Sistema", "Saída manual (legado): " + quantidadeMovimentada, null);

                if (novoSaldoUnidadeEstoque == 0) {
                    medicamento.getEstoques().remove(unidadeEstoque);
                    estoqueRepository.delete(unidadeEstoque);
                    
                    // Se zerou tudo
                    if (medicamento.getEstoques().isEmpty()) {
                        historicoService.registrar("SISTEMA", medicamento.getNome(), "Automático", "Removido por estoque zero.", null);
                        medicamentoRepository.delete(medicamento);
                        return null;
                    }
                    return null;
                }
                unidadeEstoque.setQuantidade(novoSaldoUnidadeEstoque);
                break;
            default:
                throw new RuntimeException("ERRO 400: Tipo de movimentação inválido: " + dto.getTipo() + ".");
        }
        return estoqueRepository.save(unidadeEstoque);
    }
}