package com.casaDoAmor.CasaDoAmor.dto;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class UsuarioDTO {
    private UUID id;
    private String nome;
    private String cargo;
}
