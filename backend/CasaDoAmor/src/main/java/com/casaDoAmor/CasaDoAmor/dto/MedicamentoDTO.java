package com.casaDoAmor.CasaDoAmor.dto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class MedicamentoDTO {
    private UUID id;
    private String nome;
    private String lote;
    private String formaFarmaceutica;
    private String viaDeAdministracao;
    private String concentracao;
    private String categoriaTerapeutica;
    private String laboratorioFabricante;
    private LocalDate validade;
}
