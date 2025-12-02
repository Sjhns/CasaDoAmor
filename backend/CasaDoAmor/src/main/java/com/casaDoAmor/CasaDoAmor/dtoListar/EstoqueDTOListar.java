package com.casaDoAmor.CasaDoAmor.dtoListar;

import java.time.LocalDate;
import java.util.UUID;
import com.casaDoAmor.CasaDoAmor.model.Estoque;

public record EstoqueDTOListar(
    UUID id,
    String lote,
    Long quantidade,
    LocalDate validadeAposAberto,
    String status
) {
    public static EstoqueDTOListar fromEntity(Estoque estoque) {
        return new EstoqueDTOListar(
            estoque.getId(),
            estoque.getLote(),
            estoque.getQuantidade(),
            estoque.getValidadeAposAberto(),
            estoque.getStatus()
        );
    }
}