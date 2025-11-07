package com.casaDoAmor.CasaDoAmor.dtoRequest;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class MovimentarEstoqueDTORequest {
    @NotNull
    @Min(1) 
    private Long quantidade;
    @NotBlank
    private String tipo;
}
