package com.casaDoAmor.CasaDoAmor.dtoResponse;

import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import lombok.Data;
import java.util.UUID;

@Data
public class MedicamentoDTOResponse {
    private UUID id;
    private String nome;
    private String formaFarmaceutica;       
    private String viaDeAdministracao;   
    private String concentracao; 
    private String categoriaTerapeutica;    
    private String laboratorioFabricante;    
    public static MedicamentoDTOResponse fromEntity(Medicamento medicamento) {
        MedicamentoDTOResponse dto = new MedicamentoDTOResponse();
        dto.setId(medicamento.getId());
        dto.setNome(medicamento.getNome());
        dto.setFormaFarmaceutica(medicamento.getFormaFarmaceutica());
        dto.setViaDeAdministracao(medicamento.getViaDeAdministracao());
        dto.setConcentracao(medicamento.getConcentracao());
        dto.setCategoriaTerapeutica(medicamento.getCategoriaTerapeutica());
        dto.setLaboratorioFabricante(medicamento.getLaboratorioFabricante());
        return dto;
    }
}