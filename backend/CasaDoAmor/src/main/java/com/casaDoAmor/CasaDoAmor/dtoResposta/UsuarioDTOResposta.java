package com.casaDoAmor.CasaDoAmor.dtoResposta;

import com.casaDoAmor.CasaDoAmor.model.Usuario;
import lombok.Data;
import java.util.UUID;

@Data
public class UsuarioDTOResposta {
    private UUID id;
    private String nome;
    private String cargo;
    public static UsuarioDTOResposta fromEntity(Usuario entidade) {
        UsuarioDTOResposta dto = new UsuarioDTOResposta();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setCargo(entidade.getCargo());
        return dto;
    }
}