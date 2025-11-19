package com.casaDoAmor.CasaDoAmor.dtoResposta;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class EstoqueDTOResposta {
    private UUID id;
    private Long quantidade;
    private String status;
    private String lote;
    private LocalDate validadeAposAberto;
    private MedicamentoDTOResposta medicamento; 
    public static EstoqueDTOResposta fromEntity(Estoque estoque) {
        EstoqueDTOResposta dto = new EstoqueDTOResposta();
        dto.setId(estoque.getId());
        dto.setQuantidade(estoque.getQuantidade());
        dto.setStatus(estoque.getStatus());
        dto.setLote(estoque.getLote());
        dto.setValidadeAposAberto(estoque.getValidadeAposAberto());
        if (estoque.getMedicamento() != null) {
            dto.setMedicamento(MedicamentoDTOResposta.fromEntity(estoque.getMedicamento()));
        }
        return dto;
    }
}
