package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.Usuario;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository <Usuario,UUID>{
    Optional<Usuario> findById(UUID id);
    Usuario findByNome(String nome);
    Usuario findByCargo(String cargo);
}
