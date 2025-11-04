package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.Local;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocalRepository extends JpaRepository<Local, UUID>{
    Optional <Local> findById(UUID id);
    Local findByNome(String nome);
}
