package com.casaDoAmor.CasaDoAmor.dtoCriar;

import java.util.UUID;

public record DespachoDTOCriar(
    UUID medicamentoId,
    Integer quantidade,
    String paciente,
    Boolean isPessoaExterna,
    Boolean isCartelaInteira,
    String observacao,
    String tipoMovimentacao // "SAIDA"
) {}