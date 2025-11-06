package com.casaDoAmor.CasaDoAmor.dtoResponse;

import com.casaDoAmor.CasaDoAmor.model.Doador;
import lombok.Data;
import java.util.UUID;

@Data
public class DoadorDTOResponse {
    private UUID id;
    private String nome;
    private String cpfCnpj;
    private String email;
    private String telefone;
    public static DoadorDTOResponse fromEntity(Doador entidade) {
        DoadorDTOResponse dto = new DoadorDTOResponse();
        dto.setId(entidade.getId());
        dto.setCpfCnpj(entidade.getCpfCnpj());
        dto.setNome(entidade.getNome());
        dto.setEmail(entidade.getEmail());
        dto.setTelefone(entidade.getTelefone());
        return dto;
    }
}