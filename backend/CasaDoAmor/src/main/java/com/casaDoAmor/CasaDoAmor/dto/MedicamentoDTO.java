package com.casaDoAmor.CasaDoAmor.dto;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class MedicamentoDTO {
    private UUID id;
    @NotBlank
    private String nome;
    @NotBlank
    private String lote;
    @NotBlank
    private String formaFarmaceutica;
    @NotBlank
    private String viaDeAdministracao;
    @NotBlank
    private String concentracao;
    @NotBlank
    private String categoriaTerapeutica;
    @NotBlank
    private String laboratorioFabricante;
    @NotNull
    private LocalDate validade;
}
