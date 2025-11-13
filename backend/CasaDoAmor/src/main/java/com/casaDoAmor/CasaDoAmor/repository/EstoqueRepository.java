package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, UUID>{
    Optional <Estoque> findById(UUID id);
    List<Estoque> findByQuantidade(long quantidade);
    List<Estoque> findByStatus(String status);
    List<Estoque> findByLote(String lote);
    List<Estoque> findByValidadeAposAberto(java.time.LocalDate validadeAposAberto);
    List<Estoque> findByMedicamentoId(UUID medicamentoId);
}
