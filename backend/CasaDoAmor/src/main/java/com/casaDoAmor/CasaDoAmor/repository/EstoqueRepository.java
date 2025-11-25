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
    List<Estoque> findByEstoqueMaximo(long estoqueMaximo);
    List<Estoque> findByEstoqueMinimo(long estoqueMinimo);
    List<Estoque> findByStatus(String status);
    List<Estoque> findByLote(String lote);
    List<Estoque> findByValidadeApos(LocalDate validadeAposAberto);
    List<Estoque> findByMedicamentoId(UUID medicamentoId);

    @Query("SELECT e FROM Estoque e WHERE e.quantidade <= e.estoqueMinimo")
    List<Estoque> findByEstoqueBaixo();
}
