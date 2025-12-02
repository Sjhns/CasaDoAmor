package com.casaDoAmor.CasaDoAmor.repository;

import com.casaDoAmor.CasaDoAmor.model.Historico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, UUID> {
    
    // Busca paginada ordenada por data (mais recente primeiro)
    Page<Historico> findAllByOrderByDataMovimentacaoDesc(Pageable pageable);

}