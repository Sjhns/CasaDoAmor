package com.casaDoAmor.CasaDoAmor.dtoResponse;

import com.casaDoAmor.CasaDoAmor.model.Usuario;
import lombok.Data;
import java.util.UUID;

@Data
public class UsuarioDTOResponse {
    private UUID id;
    private String nome;
    private String cargo;
    public static UsuarioDTOResponse fromEntity(Usuario entidade) {
        UsuarioDTOResponse dto = new UsuarioDTOResponse();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setCargo(entidade.getCargo());
        return dto;
    }
}