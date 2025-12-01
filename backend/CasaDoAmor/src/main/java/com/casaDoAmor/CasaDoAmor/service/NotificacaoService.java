package com.casaDoAmor.CasaDoAmor.service;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.model.Notificacao;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;
import com.casaDoAmor.CasaDoAmor.repository.NotificacaoRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("unused")
@Service
public class NotificacaoService {

    private final MedicamentoRepository medicamentoRepo;
    private final NotificacaoRepository notificacaoRepo;
    private final EmailService emailService;
    private final EstoqueRepository estoqueRepo;

    public NotificacaoService(MedicamentoRepository medRepo,
            NotificacaoRepository notRepo,
            EmailService emailSvc,
            EstoqueRepository estoqueRepo) {
        this.medicamentoRepo = medRepo;
        this.notificacaoRepo = notRepo;
        this.emailService = emailSvc;
        this.estoqueRepo = estoqueRepo;
    }

    @Scheduled(cron = "0 0 7 * * ?")
    public void executarVerificacaoAgendada() {
        // verificarMedicamentosCriticos();
    }
}
