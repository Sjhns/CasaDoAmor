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
    private String viaDeAdministracao;
    private String concentracao;
    private String categoriaTerapeutica;
    
    private Long estoqueMinimo;
    private Long estoqueMaximo;
    private Long quantidadeTotalEstoque;

    // Campos de resumo (para a linha fechada da tabela)
    private String lote;
    private LocalDate validade;

    // --- O CAMPO QUE FALTAVA ---
    private List<EstoqueDTOListar> estoques;

    public static MedicamentoEstoqueDTOListar fromEntity(Medicamento medicamento) {
        MedicamentoEstoqueDTOListar dto = new MedicamentoEstoqueDTOListar();

        // 1. Dados básicos do Medicamento
        dto.setIdMedicamento(medicamento.getId());
        dto.setNomeMedicamento(medicamento.getNome());
        dto.setFormaFarmaceutica(medicamento.getFormaFarmaceutica());
        dto.setViaDeAdministracao(medicamento.getViaDeAdministracao());
        dto.setConcentracao(medicamento.getConcentracao());
        dto.setCategoriaTerapeutica(medicamento.getCategoriaTerapeutica());
        dto.setEstoqueMinimo(medicamento.getEstoqueMinimo());
        dto.setEstoqueMaximo(medicamento.getEstoqueMaximo());

        // 2. Dados de Resumo (Primeiro lote encontrado, apenas para exibição rápida)
        Optional<Estoque> primeiroEstoque = medicamento.getEstoques().stream().findFirst();
        if (primeiroEstoque.isPresent()) {
            dto.setLote(primeiroEstoque.get().getLote());
            dto.setValidade(primeiroEstoque.get().getValidadeAposAberto());
        } else {
            dto.setLote("-");
            dto.setValidade(null);
        }

        // 3. Soma Total
        long total = medicamento.getEstoques().stream()
                .mapToLong(e -> e.getQuantidade() != null ? e.getQuantidade() : 0L)
                .sum();
        dto.setQuantidadeTotalEstoque(total);

        // 4. PREENCHENDO A LISTA (Isso fará o Accordion funcionar)
        if (medicamento.getEstoques() != null) {
            List<EstoqueDTOListar> listaEstoques = medicamento.getEstoques().stream()
                    .map(EstoqueDTOListar::fromEntity)
                    .collect(Collectors.toList());
            dto.setEstoques(listaEstoques);
        }

        return dto;
    }
}