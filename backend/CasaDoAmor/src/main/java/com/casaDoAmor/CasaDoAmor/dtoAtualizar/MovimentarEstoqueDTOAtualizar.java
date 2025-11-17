package com.casaDoAmor.CasaDoAmor.dtoAtualizar;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class MovimentarEstoqueDTOAtualizar {
    @NotNull(message = "A quantidade a ser movimentada é obrigatória.")
    @Min(value = 1, message = "A quantidade deve ser maior que zero.")
    private Long quantidade;
    @NotBlank(message = "O tipo de movimentação (ENTRADA/SAIDA) é obrigatório.")
    private String tipo;
}
