package com.casaDoAmor.CasaDoAmor.controller;

import com.casaDoAmor.CasaDoAmor.model.Notificacao;
import com.casaDoAmor.CasaDoAmor.repository.NotificacaoRepository;
import com.casaDoAmor.CasaDoAmor.service.NotificacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificacaoController {

    private final NotificacaoRepository notificacaoRepository;
    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoRepository notificacaoRepository,
            NotificacaoService notificacaoService) {
        this.notificacaoRepository = notificacaoRepository;
        this.notificacaoService = notificacaoService;
    }

    @GetMapping("/nao-lidas")
    public List<Notificacao> listarNaoLidas() {
        return notificacaoRepository.findByLidaFalseOrderByDataCriacaoDesc();
    }

    @GetMapping
    public List<Notificacao> listarTodas() {
        return notificacaoRepository.findAllByOrderByDataCriacaoDesc();
    }

    @PutMapping("/{id}/marcar-lida")
    public ResponseEntity<Notificacao> marcarComoLida(@PathVariable Long id) {
        return notificacaoRepository.findById(id)
                .map(notificacao -> {
                    notificacao.setLida(true);
                    return ResponseEntity.ok(notificacaoRepository.save(notificacao));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/marcar-todas-lidas")
    public ResponseEntity<Void> marcarTodasComoLidas() {
        List<Notificacao> naoLidas = notificacaoRepository.findByLidaFalseOrderByDataCriacaoDesc();
        naoLidas.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(naoLidas);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirNotificacao(@PathVariable Long id) {
        if (notificacaoRepository.existsById(id)) {
            notificacaoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Endpoint de teste para executar as verificações manualmente
     * Útil para testes sem precisar esperar o agendamento das 7h
     */
    @PostMapping("/verificar-agora")
    public ResponseEntity<String> verificarAgora() {
        try {
            notificacaoService.executarVerificacaoAgendada();
            return ResponseEntity.ok("✅ Verificações executadas com sucesso! Confira os emails e notificações.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("❌ Erro ao executar verificações: " + e.getMessage());
        }
    }
}
