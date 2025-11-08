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

    public void verificarMedicamentosCriticos() {
        LocalDate dataLimiteVencimento = LocalDate.now().plusDays(30);
        List<Medicamento> vencimentosProximos = medicamentoRepo.buscarPorVencimentoAntesDe(dataLimiteVencimento);

        for (Medicamento med : vencimentosProximos) {
            Notificacao notificacao = new Notificacao();
            notificacao.setTipoAlerta("VENCIMENTO_PROXIMO");
            notificacao.setMensagem("Medicamento " + med.getNome() + " vence em " + med.getValidade());
            notificacao.setDataCriacao(LocalDateTime.now());
            notificacaoRepo.save(notificacao);

            String emailAdmin = "admin@casadoamor.com"; 
            String assunto = "[ALERTA] Vencimento Próximo: " + med.getNome();
            emailService.enviarEmail(emailAdmin, assunto, notificacao.getMensagem());
        }
        List<Estoque> estoqueBaixo = estoqueRepo.findByEstoqueBaixo();

        for (Estoque estoque : estoqueBaixo) {
            String nomeMedicamento = estoque.getMedicamento().getNome();
            Long qtdAtual = estoque.getQuantidade();

            Notificacao notificacao = new Notificacao();
            notificacao.setTipoAlerta("ESTOQUE_BAIXO");
            notificacao.setMensagem("Medicamento " + nomeMedicamento + " está com estoque baixo (" + qtdAtual + " un.)");
            notificacao.setDataCriacao(LocalDateTime.now());
            notificacaoRepo.save(notificacao);

            String emailAdmin = "admin@casadoamor.com";
            String assunto = "[ALERTA] Estoque Baixo: " + nomeMedicamento;
            emailService.enviarEmail(emailAdmin, assunto, notificacao.getMensagem());
        }
    }

    @Scheduled(cron = "0 0 7 * * ?")
    public void executarVerificacaoAgendada() {
        verificarMedicamentosCriticos();
    }
}
