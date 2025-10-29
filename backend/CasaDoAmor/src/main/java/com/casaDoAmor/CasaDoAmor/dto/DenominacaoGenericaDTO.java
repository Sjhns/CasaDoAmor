package com.casaDoAmor.CasaDoAmor.dto;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class DenominacaoGenericaDTO {
    private UUID id;
    @NotBlank
    private String nome;
}