package com.casaDoAmor.CasaDoAmor.dtoAtualizar;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class DenominacaoGenericaDTOAtualizar {
    private UUID id;
    @NotBlank
    private String nome;
}