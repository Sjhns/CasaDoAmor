package com.casaDoAmor.CasaDoAmor.dto;

import com.casaDoAmor.CasaDoAmor.model.Historico;
import java.time.LocalDateTime;
import java.util.UUID;

public record HistoricoResponseDTO(
    UUID idHistorico,
    String tipo,
    String medicamentoNome,
    LocalDateTime dataMovimentacao,
    String usuarioNome,
    String destinatario, // <--- NOVO CAMPO
    String observacao
) {
    public static HistoricoResponseDTO fromEntity(Historico h) {
        return new HistoricoResponseDTO(
            h.getId(),
            h.getTipo(),
            h.getMedicamentoNome(),
            h.getDataMovimentacao(),
            h.getUsuarioNome(),
            h.getDestinatario(), 
            h.getObservacao()
        );
    }
}