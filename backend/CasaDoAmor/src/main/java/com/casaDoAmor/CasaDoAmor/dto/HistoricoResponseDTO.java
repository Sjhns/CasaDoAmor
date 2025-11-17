package com.casaDoAmor.CasaDoAmor.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HistoricoResponseDTO {
    
    private UUID idHistorico;
    private LocalDateTime dataMovimentacao;
    private String tipo;
    private String observacao;
    
    private UUID usuarioId;
    private String usuarioNome;
    
    private UUID medicamentoId;
    private String medicamentoNome;
}