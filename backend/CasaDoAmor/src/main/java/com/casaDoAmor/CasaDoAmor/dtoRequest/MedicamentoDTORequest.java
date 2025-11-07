package com.casaDoAmor.CasaDoAmor.dtoRequest;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class MedicamentoDTORequest {
    private UUID id;
    @NotBlank
    private String nome;
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
}
