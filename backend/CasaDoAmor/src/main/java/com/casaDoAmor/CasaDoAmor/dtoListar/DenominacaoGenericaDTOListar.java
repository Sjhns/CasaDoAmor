package com.casaDoAmor.CasaDoAmor.dtoListar;

import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import lombok.Data;
import java.util.UUID;

@Data
public class DenominacaoGenericaDTOListar {
    private UUID id;
    private String nome;
    public static DenominacaoGenericaDTOListar fromEntity(DenominacaoGenerica denominacaoGenerica) {
        DenominacaoGenericaDTOListar dto = new DenominacaoGenericaDTOListar();
        dto.setId(denominacaoGenerica.getId());
        dto.setNome(denominacaoGenerica.getNome());
        return dto;
    }
}