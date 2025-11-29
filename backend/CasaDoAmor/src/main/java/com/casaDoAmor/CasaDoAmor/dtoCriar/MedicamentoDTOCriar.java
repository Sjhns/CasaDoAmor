package com.casaDoAmor.CasaDoAmor.dtoCriar;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MedicamentoDTOCriar {
    @NotBlank(message = "O nome do medicamento é obrigatório.")
    private String nome;
    @NotBlank(message = "A forma farmacêutica é obrigatória.")
    private String formaFarmaceutica;
    @NotBlank(message = "A via de administração é obrigatória.")
    private String viaDeAdministracao;
    @NotBlank(message = "A concentração é obrigatória.")
    private String concentracao;
    @NotBlank(message = "A categoria terapêutica é obrigatória.")
    private String categoriaTerapeutica;
    @NotBlank(message = "O laboratório fabricante é obrigatório.")
    private String laboratorioFabricante;
    @NotNull(message = "O estoque mínimo é obrigatório.")
    @Min(value = 0, message = "O estoque mínimo não pode ser negativo.")
    private Long estoqueMinimo;
    @NotNull(message = "O estoque máximo é obrigatório.")
    @Min(value = 1, message = "O estoque máximo deve ser maior que zero.")
    private Long estoqueMaximo;
    @NotNull(message = "O ID da Denominação Genérica é obrigatório.")
    private UUID denominacaoGenericaId; 
}