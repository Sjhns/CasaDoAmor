package com.casaDoAmor.CasaDoAmor.dtoResposta;

import com.casaDoAmor.CasaDoAmor.model.Local;
import lombok.Data;
import java.util.UUID;

@Data
public class LocalDTOResposta {
    private UUID id;
    private String nome;
    public static LocalDTOResposta fromEntity(Local entidade) {
        LocalDTOResposta dto = new LocalDTOResposta();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        return dto;
    }
}