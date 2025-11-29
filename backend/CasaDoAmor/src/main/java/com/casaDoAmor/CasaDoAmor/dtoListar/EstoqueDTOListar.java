package com.casaDoAmor.CasaDoAmor.dtoListar;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class EstoqueDTOListar {
    private UUID id;
    private Long quantidade;
    private String status;
    private String lote;
    public static EstoqueDTOListar fromEntity(com.casaDoAmor.CasaDoAmor.model.Estoque estoque) {
        EstoqueDTOListar dto = new EstoqueDTOListar();
        dto.setId(estoque.getId());
        dto.setQuantidade(estoque.getQuantidade());
        dto.setStatus(estoque.getStatus());
        dto.setLote(estoque.getLote());
        return dto;
    }
}