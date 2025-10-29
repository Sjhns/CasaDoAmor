package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DenominacaoGenericaRepository extends JpaRepository<DenominacaoGenerica, UUID> {
    Optional<DenominacaoGenerica> findById(UUID id);
    DenominacaoGenerica findByNome(String nome);
}
