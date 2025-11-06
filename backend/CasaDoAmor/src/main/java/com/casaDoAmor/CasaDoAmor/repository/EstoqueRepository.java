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
    Estoque findByEstoqueMaximo(long estoqueMaximo);
    Estoque findByEstoqueMinimo(long estoqueMinimo);
    Estoque findByStatus(String status);
    Estoque findByLote(String lote);
    Estoque findByValidadeAposAberto(java.time.LocalDate validadeAposAberto);

    Optional<Estoque> findByMedicamentoId(UUID medicamentoId);
}
