package com.casaDoAmor.CasaDoAmor.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.model.Local;
import com.casaDoAmor.CasaDoAmor.repository.LocalRepository;
import jakarta.transaction.Transactional;

@Service
public class LocalService {
    LocalRepository local_repository;

    public LocalService(LocalRepository local_repository) {
        this.local_repository = local_repository;
    }
    @Transactional
    public List<Local> listarTodos() {
        return local_repository.findAll();
    }
    @Transactional
    public Local salvar(Local local) {
        return local_repository.save(local);
    }
    @Transactional
    public void deletar(Local local) {
        local_repository.delete(local);
    }
}
