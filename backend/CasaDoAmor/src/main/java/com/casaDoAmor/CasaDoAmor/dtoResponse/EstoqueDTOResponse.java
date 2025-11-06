package com.casaDoAmor.CasaDoAmor.dtoResponse;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class EstoqueDTOResponse {
    private UUID id;
    private Long quantidade;
    private Long estoqueMinimo;
    private Long estoqueMaximo;
    private String status;
    private String lote;
    private LocalDate validadeAposAberto;
    private MedicamentoDTOResponse medicamento; 
    public static EstoqueDTOResponse fromEntity(Estoque estoque) {
        EstoqueDTOResponse dto = new EstoqueDTOResponse();
        dto.setId(estoque.getId());
        dto.setQuantidade(estoque.getQuantidade());
        dto.setEstoqueMinimo(estoque.getEstoqueMinimo());
        dto.setEstoqueMaximo(estoque.getEstoqueMaximo());
        dto.setStatus(estoque.getStatus());
        dto.setLote(estoque.getLote());
        dto.setValidadeAposAberto(estoque.getValidadeAposAberto());
        if (estoque.getMedicamento() != null) {
            dto.setMedicamento(MedicamentoDTOResponse.fromEntity(estoque.getMedicamento()));
        }
        return dto;
    }
}
