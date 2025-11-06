package com.casaDoAmor.CasaDoAmor.dtoResponse;

import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import lombok.Data;
import java.util.UUID;

@Data
public class DenominacaoGenericaDTOResponse {
    private UUID id;
    private String nome;
    public static DenominacaoGenericaDTOResponse fromEntity(DenominacaoGenerica entidade) {
        DenominacaoGenericaDTOResponse dto = new DenominacaoGenericaDTOResponse();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        return dto;
    }
}