package com.casaDoAmor.CasaDoAmor.dtoResposta;
import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import lombok.Data;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
public class DenominacaoGenericaDTOResposta {
    private UUID id;
    private String nome;
    private List<MedicamentoDTOResposta> medicamentos;
    public static DenominacaoGenericaDTOResposta fromEntity(DenominacaoGenerica denominacaoGenerica) {
        DenominacaoGenericaDTOResposta dto = new DenominacaoGenericaDTOResposta();
        dto.setId(denominacaoGenerica.getId());
        dto.setNome(denominacaoGenerica.getNome());
        if (denominacaoGenerica.getMedicamentos() != null) {
             dto.setMedicamentos(denominacaoGenerica.getMedicamentos().stream()
                     .map(MedicamentoDTOResposta::fromEntity) 
                     .collect(Collectors.toList())
             );
        }
        return dto;
    }
}