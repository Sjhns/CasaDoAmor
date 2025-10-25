package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import com.casaDoAmor.CasaDoAmor.repository.DenominacaoGenericaRepository;

import jakarta.transaction.Transactional;

@Service
public class DenominacaoGenericaService {
    private final DenominacaoGenericaRepository denominacaoGenericaRepository;
    public DenominacaoGenericaService(DenominacaoGenericaRepository denominacaoGenericaRepository) {
        this.denominacaoGenericaRepository = denominacaoGenericaRepository;
    }
    @Transactional
    public DenominacaoGenerica salvar(DenominacaoGenerica denominacaoGenerica) {
        return denominacaoGenericaRepository.save(denominacaoGenerica);
    }
    @Transactional
    public void deletar(DenominacaoGenerica denominacaoGenerica) {
        denominacaoGenericaRepository.delete(denominacaoGenerica);
    }
    @Transactional
    public List<DenominacaoGenerica> listarTodos() {
        return denominacaoGenericaRepository.findAll();
    }
    @Transactional
    public Optional<DenominacaoGenerica> buscarPorId(UUID id) {
        return denominacaoGenericaRepository.findById(id); 
    }
}
