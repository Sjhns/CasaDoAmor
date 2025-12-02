package com.casaDoAmor.CasaDoAmor.service;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.model.Notificacao;
import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;
import com.casaDoAmor.CasaDoAmor.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${app.notificacao.email-responsavel:gestor@casadoamor.org}")
    private String emailResponsavel;

    public NotificacaoService(MedicamentoRepository medRepo,
            NotificacaoRepository notRepo,
            EmailService emailSvc,
            EstoqueRepository estoqueRepo) {
        this.medicamentoRepo = medRepo;
        this.notificacaoRepo = notRepo;
        this.emailService = emailSvc;
        this.estoqueRepo = estoqueRepo;
    }

    /**
     * Executa verificações automáticas todos os dias às 7h da manhã
     */
    @Scheduled(cron = "0 0 7 * * ?")
    public void executarVerificacaoAgendada() {
        verificarMedicamentosCriticos();
        verificarMedicamentosVencidos();
        verificarMedicamentosProximosVencimento();
    }

    /**
     * Verifica medicamentos com estoque abaixo do mínimo
     */
    public void verificarMedicamentosCriticos() {
        List<Medicamento> medicamentos = medicamentoRepo.findAll();

        for (Medicamento med : medicamentos) {
            long saldoTotal = med.getEstoques().stream()
                    .mapToLong(Estoque::getQuantidade)
                    .sum();

            if (saldoTotal <= med.getEstoqueMinimo() && saldoTotal > 0) {
                // Política: única até ser lida; se lida, reenviar após 7 dias se persistir
                Notificacao ultima = notificacaoRepo
                        .findTopByTipoAlertaAndNomeMedicamentoOrderByDataCriacaoDesc(
                                "ESTOQUE_CRITICO", med.getNome());

                boolean deveCriar = false;
                if (ultima == null) {
                    deveCriar = true;
                } else if (!ultima.isLida()) {
                    deveCriar = false; // ainda não lida: não duplicar
                } else {
                    deveCriar = ultima.getDataCriacao().isBefore(LocalDateTime.now().minusDays(7));
                }

                if (deveCriar) {
                    criarNotificacao(
                            "ESTOQUE_CRITICO",
                            "Estoque crítico: " + med.getNome() + " está com apenas " + saldoTotal + " unidades!",
                            med.getNome(),
                            null,
                            (int) saldoTotal);

                    // Enviar email
                    try {
                        emailService.enviarEmail(
                                emailResponsavel,
                                "⚠️ Alerta: Estoque Crítico - " + med.getNome(),
                                "O medicamento " + med.getNome() + " está com estoque crítico!\n\n" +
                                        "Quantidade atual: " + saldoTotal + " unidades\n" +
                                        "Estoque mínimo: " + med.getEstoqueMinimo() + " unidades\n\n" +
                                        "Por favor, providencie a reposição com urgência.");
                    } catch (Exception e) {
                        System.err.println("Erro ao enviar email: " + e.getMessage());
                    }
                }
            }
        }
    }

    /**
     * Verifica medicamentos já vencidos
     */
    public void verificarMedicamentosVencidos() {
        List<Estoque> estoques = estoqueRepo.findAll();
        LocalDate hoje = LocalDate.now();
        java.util.Set<String> enviadosEstaExecucao = new java.util.HashSet<>();

        for (Estoque estoque : estoques) {
            if (estoque.getValidadeAposAberto() != null) {
                LocalDate dataVencimento = estoque.getValidadeAposAberto();

                if (dataVencimento.isBefore(hoje)) {
                    // Política de repetição: única até ser lida; se lida, reenviar após 7 dias se
                    // persistir
                    Notificacao ultima = notificacaoRepo
                            .findTopByTipoAlertaAndNomeMedicamentoAndDataVencimentoOrderByDataCriacaoDesc(
                                    "VENCIDO",
                                    estoque.getMedicamento().getNome(),
                                    dataVencimento.atStartOfDay());

                    boolean deveCriar = false;
                    if (ultima == null) {
                        deveCriar = true;
                    } else if (!ultima.isLida()) {
                        deveCriar = false; // ainda não lida: não duplicar
                    } else {
                        // Lida: permitir novo alerta somente após 7 dias
                        deveCriar = ultima.getDataCriacao().isBefore(LocalDateTime.now().minusDays(7));
                    }

                    String chave = "VENCIDO|" + estoque.getMedicamento().getNome() + "|" + dataVencimento.toString();
                    if (deveCriar && enviadosEstaExecucao.add(chave)) {
                        criarNotificacao(
                                "VENCIDO",
                                "Medicamento vencido: " + estoque.getMedicamento().getNome() +
                                        " (Lote: " + estoque.getLote() + ") venceu em " + dataVencimento,
                                estoque.getMedicamento().getNome(),
                                dataVencimento.atStartOfDay(),
                                estoque.getQuantidade().intValue());

                        try {
                            emailService.enviarEmail(
                                    emailResponsavel,
                                    "🚨 Alerta: Medicamento Vencido - " + estoque.getMedicamento().getNome(),
                                    "O medicamento " + estoque.getMedicamento().getNome() + " está VENCIDO!\n\n" +
                                            "Lote: " + estoque.getLote() + "\n" +
                                            "Vencimento: " + dataVencimento + "\n" +
                                            "Quantidade: " + estoque.getQuantidade() + " unidades\n\n" +
                                            "Por favor, remova este lote do estoque imediatamente!");
                        } catch (Exception e) {
                            System.err.println("Erro ao enviar email: " + e.getMessage());
                        }
                    }
                }
            }
        }
    }

    /**
     * Verifica medicamentos próximos do vencimento (30 dias)
     */
    public void verificarMedicamentosProximosVencimento() {
        List<Estoque> estoques = estoqueRepo.findAll();
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(30);
        java.util.Set<String> enviadosEstaExecucao = new java.util.HashSet<>();

        for (Estoque estoque : estoques) {
            if (estoque.getValidadeAposAberto() != null) {
                LocalDate dataVencimento = estoque.getValidadeAposAberto();

                if (dataVencimento.isAfter(hoje) && dataVencimento.isBefore(limite)) {
                    // Política de repetição: única até ser lida; se lida, reenviar após 7 dias se
                    // persistir
                    Notificacao ultima = notificacaoRepo
                            .findTopByTipoAlertaAndNomeMedicamentoAndDataVencimentoOrderByDataCriacaoDesc(
                                    "PROXIMO_VENCIMENTO",
                                    estoque.getMedicamento().getNome(),
                                    dataVencimento.atStartOfDay());

                    boolean deveCriar = false;
                    if (ultima == null) {
                        deveCriar = true;
                    } else if (!ultima.isLida()) {
                        deveCriar = false; // ainda não lida: não duplicar
                    } else {
                        // Lida: permitir novo alerta somente após 7 dias
                        deveCriar = ultima.getDataCriacao().isBefore(LocalDateTime.now().minusDays(7));
                    }

                    String chave = "PROXIMO_VENCIMENTO|" + estoque.getMedicamento().getNome() + "|"
                            + dataVencimento.toString();
                    if (deveCriar && enviadosEstaExecucao.add(chave)) {
                        long diasRestantes = java.time.temporal.ChronoUnit.DAYS.between(hoje, dataVencimento);

                        criarNotificacao(
                                "PROXIMO_VENCIMENTO",
                                "Próximo ao vencimento: " + estoque.getMedicamento().getNome() +
                                        " (Lote: " + estoque.getLote() + ") vence em " + diasRestantes + " dias",
                                estoque.getMedicamento().getNome(),
                                dataVencimento.atStartOfDay(),
                                estoque.getQuantidade().intValue());

                        try {
                            emailService.enviarEmail(
                                    emailResponsavel,
                                    "⏰ Alerta: Vencimento Próximo - " + estoque.getMedicamento().getNome(),
                                    "O medicamento " + estoque.getMedicamento().getNome()
                                            + " está próximo do vencimento!\n\n" +
                                            "Lote: " + estoque.getLote() + "\n" +
                                            "Vencimento: " + dataVencimento + "\n" +
                                            "Dias restantes: " + diasRestantes + "\n" +
                                            "Quantidade: " + estoque.getQuantidade() + " unidades\n\n" +
                                            "Planeje a utilização ou descarte adequado.");
                        } catch (Exception e) {
                            System.err.println("Erro ao enviar email: " + e.getMessage());
                        }
                    }
                }
            }
        }
    }

    /**
     * Cria uma notificação no banco de dados
     */
    private void criarNotificacao(String tipo, String mensagem, String nomeMedicamento,
            LocalDateTime dataVencimento, Integer quantidade) {
        Notificacao notificacao = new Notificacao();
        notificacao.setTipoAlerta(tipo);
        notificacao.setMensagem(mensagem);
        notificacao.setNomeMedicamento(nomeMedicamento);
        notificacao.setDataVencimento(dataVencimento);
        notificacao.setQuantidade(quantidade);
        notificacao.setDataCriacao(LocalDateTime.now());
        notificacao.setLida(false);

        notificacaoRepo.save(notificacao);
    }

    /**
     * Método público para criar notificação customizada e enviar email
     */
    public void criarNotificacaoComEmail(String tipo, String mensagem, String nomeMedicamento,
            String emailDestino, String assuntoEmail) {
        criarNotificacao(tipo, mensagem, nomeMedicamento, null, null);

        if (emailDestino != null && !emailDestino.isEmpty()) {
            try {
                emailService.enviarEmail(emailDestino, assuntoEmail, mensagem);
            } catch (Exception e) {
                System.err.println("Erro ao enviar email: " + e.getMessage());
            }
        }
    }
}
