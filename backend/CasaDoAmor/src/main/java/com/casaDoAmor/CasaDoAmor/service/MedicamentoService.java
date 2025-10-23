package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;

import jakarta.transaction.Transactional;

@Service
public class MedicamentoService {
    MedicamentoRepository medicamentoRepository;
    public MedicamentoService(MedicamentoRepository medicamentoRepository) {
        this.medicamentoRepository = medicamentoRepository;
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
}
