package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.casaDoAmor.CasaDoAmor.model.Doador;
import com.casaDoAmor.CasaDoAmor.repository.DoadorRepository;

import jakarta.transaction.Transactional;

@Service
public class DoadorService {
    DoadorRepository doadorRepository;

    public DoadorService(DoadorRepository doadorRepository) {
        this.doadorRepository = doadorRepository;
    }
    @Transactional
    public Doador salvar(Doador doador) {
        return doadorRepository.save(doador);
    }
    @Transactional
    public List<Doador> listarTodos() {
        return doadorRepository.findAll();
    }
    @Transactional
    public void deletar(Doador doador) {
        doadorRepository.delete(doador);
    }
}
