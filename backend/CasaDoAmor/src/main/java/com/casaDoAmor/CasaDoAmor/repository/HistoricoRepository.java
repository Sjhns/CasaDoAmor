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

    @Query("SELECT h FROM Historico h " +
           "JOIN h.usuario u " +
           "JOIN h.medicamento m " +
           "WHERE (:dataInicio IS NULL OR h.dataMovimentacao >= :dataInicio) " +
           "AND (:dataFim IS NULL OR h.dataMovimentacao <= :dataFim) " +
           "AND (:usuarioId IS NULL OR u.id = :usuarioId) " +
           "AND (:medicamentoId IS NULL OR m.id = :medicamentoId) " +
           "AND (:tipo IS NULL OR h.tipo = :tipo)")
    Page<Historico> findByFilters(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            @Param("usuarioId") UUID usuarioId,
            @Param("medicamentoId") UUID medicamentoId,
            @Param("tipo") String tipo,
            Pageable pageable
    );
}