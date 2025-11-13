package com.casaDoAmor.CasaDoAmor.dtoResposta;

import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.dtoListar.DenominacaoGenericaDTOListar;
import com.casaDoAmor.CasaDoAmor.dtoListar.EstoqueDTOListar; // ⚠️ Assumindo a existência e o uso de um DTO simples/listar
import lombok.Data;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class MedicamentoDTOResposta {
    private UUID id;
    private String nome;
    private String formaFarmaceutica;       
    private String viaDeAdministracao;    
    private String concentracao; 
    private String categoriaTerapeutica;      
    private String laboratorioFabricante;     
    private Long estoqueMinimo; 
    private Long estoqueMaximo;
    private List<EstoqueDTOListar> estoques;
    private DenominacaoGenericaDTOListar denominacaoGenerica;
    public static MedicamentoDTOResposta fromEntity(Medicamento medicamento) {
        MedicamentoDTOResposta dto = new MedicamentoDTOResposta();
        dto.setId(medicamento.getId());
        dto.setNome(medicamento.getNome());
        dto.setFormaFarmaceutica(medicamento.getFormaFarmaceutica());
        dto.setViaDeAdministracao(medicamento.getViaDeAdministracao());
        dto.setConcentracao(medicamento.getConcentracao());
        dto.setCategoriaTerapeutica(medicamento.getCategoriaTerapeutica());
        dto.setLaboratorioFabricante(medicamento.getLaboratorioFabricante());
        dto.setEstoqueMinimo(medicamento.getEstoqueMinimo());
        dto.setEstoqueMaximo(medicamento.getEstoqueMaximo());
        if (medicamento.getEstoques() != null) {
            dto.setEstoques(medicamento.getEstoques().stream()
                .map(EstoqueDTOListar::fromEntity) 
                .collect(Collectors.toList()));
        }
        if (medicamento.getDenominacaoGenerica() != null) {
            dto.setDenominacaoGenerica(
                DenominacaoGenericaDTOListar.fromEntity(medicamento.getDenominacaoGenerica())
            );
        }
        return dto;
    }
}