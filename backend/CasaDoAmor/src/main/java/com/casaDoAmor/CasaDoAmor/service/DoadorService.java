package com.casaDoAmor.CasaDoAmor.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.model.Doador;
import com.casaDoAmor.CasaDoAmor.repository.DoadorRepository;
import jakarta.transaction.Transactional;

@Service
public class DoadorService {
    DoadorRepository doador_repository;

    public DoadorService(DoadorRepository doador_repository) {
        this.doador_repository = doador_repository;
    }
    @Transactional
    public List<Doador> listarTodos() {
        return doador_repository.findAll();
    }
    @Transactional
    public Doador salvar(Doador doador) {
        return doador_repository.save(doador);
    }
    @Transactional
    public void deletar(Doador doador) {
        doador_repository.delete(doador);
    }
}
