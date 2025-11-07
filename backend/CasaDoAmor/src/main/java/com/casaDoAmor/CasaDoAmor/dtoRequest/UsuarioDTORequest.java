package com.casaDoAmor.CasaDoAmor.dtoRequest;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class UsuarioDTORequest {
    private UUID id;
    @NotBlank
    private String nome;
    @NotBlank
    private String cargo;
}
