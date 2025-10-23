package com.casaDoAmor.CasaDoAmor.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
import jakarta.transaction.Transactional;

@Service
public class EstoqueService {
    EstoqueRepository estoque_repository;

    public EstoqueService(EstoqueRepository estoque_repository) {
        this.estoque_repository = estoque_repository;
    }
    @Transactional
    public List<Estoque> listarTodos() {
        return estoque_repository.findAll();
    }
    @Transactional
    public Estoque salvar(Estoque estoque) {
        return estoque_repository.save(estoque);
    }
    @Transactional
    public void deletar(Estoque estoque) {
        estoque_repository.delete(estoque);
    }
}
