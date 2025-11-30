package com.casaDoAmor.CasaDoAmor.repository;

import com.casaDoAmor.CasaDoAmor.model.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    List<Notificacao> findByLidaFalseOrderByDataCriacaoDesc();
    List<Notificacao> findAllByOrderByDataCriacaoDesc();
}
