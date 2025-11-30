package com.casaDoAmor.CasaDoAmor.controller;

import com.casaDoAmor.CasaDoAmor.model.Notificacao;
import com.casaDoAmor.CasaDoAmor.repository.NotificacaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificacaoController {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoController(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
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
}
