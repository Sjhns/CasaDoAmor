package com.casaDoAmor.CasaDoAmor.service;

import com.casaDoAmor.CasaDoAmor.dto.HistoricoResponseDTO;
import com.casaDoAmor.CasaDoAmor.model.Historico;
import com.casaDoAmor.CasaDoAmor.repository.HistoricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class HistoricoService {

    private final HistoricoRepository historicoRepository;

    public HistoricoService(HistoricoRepository historicoRepository) {
        this.historicoRepository = historicoRepository;
    }

    // --- MÉTODO PRINCIPAL DE REGISTRO ---
    public void registrar(String tipo, String nomeMedicamento, String nomeUsuario, String observacao, String destinatario) {
        Historico h = new Historico();
        h.setTipo(tipo);
        h.setMedicamentoNome(nomeMedicamento);
        h.setUsuarioNome(nomeUsuario != null ? nomeUsuario : "Sistema");
        h.setObservacao(observacao);
        h.setDestinatario(destinatario);
        // dataMovimentacao é setada pelo @PrePersist na model
        
        historicoRepository.save(h);
    }

    // Método de busca para o Controller
    public Page<HistoricoResponseDTO> buscarHistorico(
            LocalDateTime dataInicio, LocalDateTime dataFim, 
            UUID usuarioId, UUID medicamentoId, String tipo, 
            Pageable pageable) {
        
        // Simplificação: Retornando tudo ordenado. 
        // Se precisar dos filtros (dataInicio, etc), implementamos Specifications depois.
        return historicoRepository.findAllByOrderByDataMovimentacaoDesc(pageable)
                .map(HistoricoResponseDTO::fromEntity);
    }
}