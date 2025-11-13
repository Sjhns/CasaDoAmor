package com.casaDoAmor.CasaDoAmor.dtoCriar;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DenominacaoGenericaDTOCriar {
    @NotBlank(message = "O nome da Denominação Genérica é obrigatório.")
    private String nome;
}