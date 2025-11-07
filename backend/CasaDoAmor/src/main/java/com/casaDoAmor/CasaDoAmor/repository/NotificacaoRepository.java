package com.CasaDoAmor.CasaDoAmor.repository;

import com.CasaDoAmor.CasaDoAmor.model.Notificacao; // <-- ESTE É O IMPORT QUE FALTAVA
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
}
