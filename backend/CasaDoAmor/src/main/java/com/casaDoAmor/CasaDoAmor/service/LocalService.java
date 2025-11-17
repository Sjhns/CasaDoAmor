package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.casaDoAmor.CasaDoAmor.model.Local;
import com.casaDoAmor.CasaDoAmor.repository.LocalRepository;



@Service
public class LocalService {
    private final LocalRepository localRepository;
    public LocalService(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }
    @Transactional
    public Local salvar(Local local) {
        return localRepository.save(local);
    }
    @Transactional
    public void deletar(Local local) {
        localRepository.delete(local);
    }
    @Transactional
    public List<Local> listarTodos() {
        return localRepository.findAll();
    }
}
