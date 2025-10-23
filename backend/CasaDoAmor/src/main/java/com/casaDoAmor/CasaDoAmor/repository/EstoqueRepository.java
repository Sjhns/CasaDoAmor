package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;



@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, UUID>{
    Optional <Estoque> findById(UUID id);
    Estoque findByQuantidade(long quantidade);
    Estoque findByEstoque_maximo(long estoque_maximo);
    Estoque findByEstoque_minimo(long estoque_minimo);
    Estoque findByStatus(String status);
}
