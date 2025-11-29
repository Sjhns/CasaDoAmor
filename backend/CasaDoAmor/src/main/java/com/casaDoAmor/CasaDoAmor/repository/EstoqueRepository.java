package com.casaDoAmor.CasaDoAmor.repository;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, UUID> {

    List<Estoque> findByQuantidade(long quantidade);
    List<Estoque> findByStatus(String status);
    List<Estoque> findByLote(String lote);  
    List<Estoque> findByMedicamentoId(UUID medicamentoId);
}
