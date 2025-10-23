package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;

import jakarta.transaction.Transactional;

@Service
public class EstoqueService {
    EstoqueRepository estoqueRepository;
    public EstoqueService(EstoqueRepository estoqueRepository) {
        this.estoqueRepository = estoqueRepository;
    }
    @Transactional
    public Estoque salvar(Estoque estoque) {
        return estoqueRepository.save(estoque);
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
