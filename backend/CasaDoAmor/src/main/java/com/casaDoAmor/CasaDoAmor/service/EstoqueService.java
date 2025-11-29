package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.dtoCriar.EstoqueDTOCriar; 
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EstoqueService {
    private final EstoqueRepository estoqueRepository;
    private final MedicamentoRepository medicamentoRepository;
    public EstoqueService(EstoqueRepository estoqueRepository, MedicamentoRepository medicamentoRepository) {
        this.estoqueRepository = estoqueRepository;
        this.medicamentoRepository = medicamentoRepository;
    }
    @Transactional
    public Estoque salvar(EstoqueDTOCriar dto) { 
        UUID medicamentoId = dto.getMedicamentoId();
        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
             .orElseThrow(() -> new RuntimeException("Medicamento não encontrado com ID: " + medicamentoId));
        long saldoAtualTotal = medicamento.getEstoques().stream()
            .mapToLong(Estoque::getQuantidade)
            .sum();
        long quantidadeNova = dto.getQuantidade();
        long novoSaldoTotal = saldoAtualTotal + quantidadeNova;
        long estoqueMaximo = medicamento.getEstoqueMaximo();
        if (novoSaldoTotal > estoqueMaximo) {
            throw new RuntimeException("ENTRADA INVÁLIDA: O estoque total (" + novoSaldoTotal + ") ultrapassa o limite máximo (" + estoqueMaximo + ") do medicamento.");
        }
        if (medicamento.getEstoques().stream().anyMatch(e -> e.getLote().equals(dto.getLote()))) {
            throw new RuntimeException("Lote duplicado: O lote " + dto.getLote() + " já está registrado para este medicamento. Use a movimentação/atualização.");
        }
        Estoque novoEstoque = new Estoque();
        novoEstoque.setQuantidade(dto.getQuantidade());
        novoEstoque.setStatus(dto.getStatus());
        novoEstoque.setLote(dto.getLote());
        novoEstoque.setValidadeAposAberto(dto.getValidadeAposAberto());
        medicamento.getEstoques().add(novoEstoque); 
        novoEstoque.setMedicamento(medicamento); 
        return estoqueRepository.save(novoEstoque);
    }
    @Transactional
    public void deletar(Estoque estoque) {
        estoqueRepository.delete(estoque);
    }
    
    @Transactional
    public List<Estoque> listarTodos() {
        return estoqueRepository.findAll();
    }
}