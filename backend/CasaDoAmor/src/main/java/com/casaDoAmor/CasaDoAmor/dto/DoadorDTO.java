package com.casaDoAmor.CasaDoAmor.dto;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class DoadorDTO {
    private UUID id;
    private String cpfCnpj;
    private String nome;
    private String email;
    private String telefone;
}
