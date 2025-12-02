package com.casaDoAmor.CasaDoAmor.dtoListar;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
public class MedicamentoEstoqueDTOListar {
    private UUID idMedicamento;
    private String nomeMedicamento;
    private String formaFarmaceutica;
    private String categoriaTerapeutica;
    
    // --- CAMPOS QUE FALTAVAM ---
    private String laboratorioFabricante;
    private String viaDeAdministracao;
    private String concentracao;
    // ---------------------------

    private Long estoqueMinimo;
    private Long estoqueMaximo;
    private Long quantidadeTotalEstoque;

    private String lote;
    private LocalDate validade;

    private List<EstoqueDTOListar> estoques;

    public static MedicamentoEstoqueDTOListar fromEntity(Medicamento medicamento) {
        MedicamentoEstoqueDTOListar dto = new MedicamentoEstoqueDTOListar();

        dto.setIdMedicamento(medicamento.getId());
        dto.setNomeMedicamento(medicamento.getNome());
        dto.setFormaFarmaceutica(medicamento.getFormaFarmaceutica());
        dto.setCategoriaTerapeutica(medicamento.getCategoriaTerapeutica());
        
        // --- MAPEANDO OS CAMPOS NOVOS ---
        dto.setLaboratorioFabricante(medicamento.getLaboratorioFabricante());
        dto.setViaDeAdministracao(medicamento.getViaDeAdministracao());
        dto.setConcentracao(medicamento.getConcentracao());
        // --------------------------------

        dto.setEstoqueMinimo(medicamento.getEstoqueMinimo());
        dto.setEstoqueMaximo(medicamento.getEstoqueMaximo());

        // Dados de Resumo (Primeiro lote)
        Optional<Estoque> primeiroEstoque = medicamento.getEstoques().stream().findFirst();
        if (primeiroEstoque.isPresent()) {
            dto.setLote(primeiroEstoque.get().getLote());
            dto.setValidade(primeiroEstoque.get().getValidadeAposAberto());
        } else {
            dto.setLote("-");
            dto.setValidade(null);
        }

        // Soma Total
        long total = medicamento.getEstoques().stream()
                .mapToLong(e -> e.getQuantidade() != null ? e.getQuantidade() : 0L)
                .sum();
        dto.setQuantidadeTotalEstoque(total);

        // Lista de Detalhes
        if (medicamento.getEstoques() != null) {
            List<EstoqueDTOListar> listaEstoques = medicamento.getEstoques().stream()
                    .map(EstoqueDTOListar::fromEntity)
                    .collect(Collectors.toList());
            dto.setEstoques(listaEstoques);
        }

        return dto;
    }
}