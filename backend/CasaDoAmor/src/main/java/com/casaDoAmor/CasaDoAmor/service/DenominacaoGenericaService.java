package com.casaDoAmor.CasaDoAmor.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import com.casaDoAmor.CasaDoAmor.repository.DenominacaoGenericaRepository;
import jakarta.transaction.Transactional;

@Service
public class DenominacaoGenericaService {
    DenominacaoGenericaRepository denominacao_generica_repository;

    public DenominacaoGenericaService(DenominacaoGenericaRepository denominacao_generica_repository) {
        this.denominacao_generica_repository = denominacao_generica_repository;
    }
    @Transactional
    public List<DenominacaoGenerica> listarTodos() {
        return denominacao_generica_repository.findAll();
    }
    @Transactional
    public DenominacaoGenerica salvar(DenominacaoGenerica denominacaoGenerica) {
        return denominacao_generica_repository.save(denominacaoGenerica);
    }
    @Transactional
    public void deletar(DenominacaoGenerica denominacaoGenerica) {
        denominacao_generica_repository.delete(denominacaoGenerica);
    }
}
