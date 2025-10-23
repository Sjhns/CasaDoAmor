package com.casaDoAmor.CasaDoAmor.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import jakarta.transaction.Transactional;

@Service
public class MedicamentoService {
    MedicamentoRepository medicamento_repository;

    public MedicamentoService(MedicamentoRepository medicamento_repository) {
        this.medicamento_repository = medicamento_repository;
    }
    @Transactional
    public List<Medicamento> listarTodos() {
        return medicamento_repository.findAll();
    }
    @Transactional
    public Medicamento salvar(Medicamento medicamento) {
        return medicamento_repository.save(medicamento);
    }
    @Transactional
    public void deletar(Medicamento medicamento) {
        medicamento_repository.delete(medicamento);
    }
}
