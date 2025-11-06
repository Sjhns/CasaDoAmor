package com.casaDoAmor.CasaDoAmor.dtoResponse;

import com.casaDoAmor.CasaDoAmor.model.Local;
import lombok.Data;
import java.util.UUID;

@Data
public class LocalDTOResponse {
    private UUID id;
    private String nome;
    public static LocalDTOResponse fromEntity(Local entidade) {
        LocalDTOResponse dto = new LocalDTOResponse();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        return dto;
    }
}