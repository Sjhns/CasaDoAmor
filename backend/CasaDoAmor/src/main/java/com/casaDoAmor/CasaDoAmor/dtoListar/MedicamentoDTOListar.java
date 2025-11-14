package com.casaDoAmor.CasaDoAmor.dtoListar;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import lombok.Data;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;
@Data
public class MedicamentoDTOListar {
    private UUID id;
    private String nome;
    private String concentracao;
    private String laboratorioFabricante;
    private Long estoqueMinimo;
    private Long estoqueMaximo;
    private List<EstoqueDTOListar> estoques; 
    private DenominacaoGenericaDTOListar denominacaoGenerica;
    public static MedicamentoDTOListar fromEntity(Medicamento medicamento) {
        MedicamentoDTOListar dto = new MedicamentoDTOListar();
        dto.setId(medicamento.getId());
        dto.setNome(medicamento.getNome());
        dto.setConcentracao(medicamento.getConcentracao());
        dto.setLaboratorioFabricante(medicamento.getLaboratorioFabricante());
        dto.setEstoqueMinimo(medicamento.getEstoqueMinimo());
        dto.setEstoqueMaximo(medicamento.getEstoqueMaximo());
        if (medicamento.getEstoques() != null) {
            dto.setEstoques(
                medicamento.getEstoques().stream()
                    .map(EstoqueDTOListar::fromEntity)
                    .collect(Collectors.toList())
            );
        }
        if (medicamento.getDenominacaoGenerica() != null) {
            dto.setDenominacaoGenerica(
                DenominacaoGenericaDTOListar.fromEntity(medicamento.getDenominacaoGenerica())
            );
        }
        
        return dto;
    }
}