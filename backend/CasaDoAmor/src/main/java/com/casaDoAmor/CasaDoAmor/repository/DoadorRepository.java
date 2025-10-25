package com.casaDoAmor.CasaDoAmor.repository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.Doador;
import org.springframework.stereotype.Repository;

@Repository
public interface DoadorRepository extends JpaRepository<Doador, UUID>{
    Optional<Doador> findById(UUID id);
    Doador findByCpfCnpj(String cpfCnpj);
    Doador findByNome(String nome);
    Doador findByTelefone(String telefone);
    Doador findByEmail(String email);

}
