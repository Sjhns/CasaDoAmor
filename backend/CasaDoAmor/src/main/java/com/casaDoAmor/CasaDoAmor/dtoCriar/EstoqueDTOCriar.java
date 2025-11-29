package com.casaDoAmor.CasaDoAmor.dtoCriar;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.UUID;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class EstoqueDTOCriar {
    @NotNull(message = "O ID do medicamento é obrigatório.")
    private UUID medicamentoId; 
    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 0, message = "A quantidade não pode ser negativa.")
    private Long quantidade;
    @NotBlank(message = "O status do estoque é obrigatório.")
    private String status;
    @NotBlank(message = "O número do lote é obrigatório.")
    private String lote;
    @NotNull(message = "A data de validade é obrigatória.")
    private LocalDate validadeAposAberto;
}