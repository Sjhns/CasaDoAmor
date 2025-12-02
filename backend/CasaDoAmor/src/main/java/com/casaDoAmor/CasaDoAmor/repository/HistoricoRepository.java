package com.casaDoAmor.CasaDoAmor.repository;

import com.casaDoAmor.CasaDoAmor.model.Historico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, UUID> {

    @Query("SELECT h FROM Historico h WHERE " +
           "(:tipo IS NULL OR h.tipo = :tipo) AND " +
           "(:usuario IS NULL OR LOWER(h.usuarioNome) LIKE LOWER(CONCAT('%', :usuario, '%'))) AND " +
           "(:medicamento IS NULL OR LOWER(h.medicamentoNome) LIKE LOWER(CONCAT('%', :medicamento, '%'))) AND " +
           "(:dataInicio IS NULL OR h.dataMovimentacao >= :dataInicio) AND " +
           "(:dataFim IS NULL OR h.dataMovimentacao <= :dataFim)")
    Page<Historico> buscarComFiltros(
            @Param("tipo") String tipo,
            @Param("usuario") String usuario,
            @Param("medicamento") String medicamento,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            Pageable pageable
    );
}