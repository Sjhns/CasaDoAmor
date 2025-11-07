package com.casaDoAmor.CasaDoAmor.service;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
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
    public Estoque salvar(Estoque estoque) {
        UUID medicamentoId = estoque.getId();
        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
             .orElseThrow(() -> new RuntimeException("Medicamento não encontrado com ID: " + medicamentoId)); 
        estoque.setMedicamento(medicamento);
        medicamento.setEstoque(estoque);
        Medicamento medicamentoSalvo = medicamentoRepository.save(medicamento);
        return medicamentoSalvo.getEstoque();
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
