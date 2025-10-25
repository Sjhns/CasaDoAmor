package com.casaDoAmor.CasaDoAmor.dto;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class EstoqueDTO {
    private UUID id;
    private long quantidade;
    private long estoqueMinimo;
    private long estoqueMaximo;
    private String status;
}
