package com.casaDoAmor.CasaDoAmor.dtoAtualizar;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class MedicamentoDTOAtualizar {
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
    @NotNull
    private Long estoqueMinimo;
    @NotNull
    private Long estoqueMaximo;
}
