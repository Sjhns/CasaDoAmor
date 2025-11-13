package com.casaDoAmor.CasaDoAmor.dtoAtualizar;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class DoadorDTOAtualizar {
    private UUID id;
    @NotBlank
    private String cpfCnpj;
    @NotBlank
    private String nome;
    @NotBlank
    private String email;
    @NotBlank
    private String telefone;
    @NotBlank
    private String endereco;
}
