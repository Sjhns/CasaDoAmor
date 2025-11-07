package com.casaDoAmor.CasaDoAmor.dtoRequest;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class EstoqueDTORequest {
    private UUID id;
    @NotNull
    @Min(0)
    private Long quantidade;
    @Min(0)
    private Long estoqueMinimo;
    @Min(0)
    private Long estoqueMaximo;
    @NotBlank
    private String status;
    @NotBlank
    private String lote;
    @NotNull
    private LocalDate validadeAposAberto;
}
