package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casaDoAmor.CasaDoAmor.dtoRequest.MovimentarEstoqueDTORequest;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;

@Service
public class MedicamentoService {
    private final MedicamentoRepository medicamentoRepository;    
    private final EstoqueRepository estoqueRepository;
    public MedicamentoService(MedicamentoRepository medicamentoRepository, EstoqueRepository estoqueRepository) {
        this.medicamentoRepository = medicamentoRepository;
        this.estoqueRepository = estoqueRepository;
    }
    @Transactional
    public Medicamento salvar(Medicamento medicamento) {
        return medicamentoRepository.save(medicamento);
    }
    @Transactional
    public void deletar(Medicamento medicamento) {
        medicamentoRepository.delete(medicamento);
    }
    @Transactional
    public List<Medicamento> listarTodos() {
        return medicamentoRepository.findAll();
    }
    @Transactional
    public Estoque movimentarEstoque(UUID medicamentoId, MovimentarEstoqueDTORequest dto){
        Estoque estoque = estoqueRepository.findByMedicamentoId(medicamentoId)
            .orElseThrow(() -> new RuntimeException("ERRO 404: Estoque não encontrado para o ID: " + medicamentoId)); 
        long quantidadeMovimentada = dto.getQuantidade();
        long quantidadeAtual = estoque.getQuantidade();
        long quantidadeMinima = estoque.getEstoqueMinimo();
        long quantidadeMaxima = estoque.getEstoqueMaximo();
        long novoSaldo;
        if (quantidadeMovimentada <= 0) {
            throw new RuntimeException("ERRO 400: A quantidade a ser movimentada deve ser maior que zero.");
        }
        switch (dto.getTipo().toUpperCase()) {
            case "ENTRADA":
                novoSaldo = quantidadeAtual + quantidadeMovimentada;
                if (novoSaldo > quantidadeMaxima) {
                    throw new RuntimeException("ENTRADA INVÁLIDA: O saldo de " + novoSaldo + 
                                            " ultrapassa o estoque máximo (" + quantidadeMaxima + ")."); 
                }
                break;
            case "SAIDA":
                novoSaldo = quantidadeAtual - quantidadeMovimentada;
                if (novoSaldo < quantidadeMinima) {
                    throw new RuntimeException("SAÍDA INVÁLIDA: O saldo de " + novoSaldo + 
                                            " é inferior ao estoque mínimo (" + quantidadeMinima + ").");
                }
                break;
            default:
                throw new RuntimeException("ERRO 400: Tipo de movimentação inválido: " + dto.getTipo() + ".");
        }
        estoque.setQuantidade(novoSaldo);
        return estoqueRepository.save(estoque);
    }
}
