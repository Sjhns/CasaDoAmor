package com.casaDoAmor.CasaDoAmor.dtoListar;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import lombok.Data;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Data
public class MedicamentoEstoqueDTOListar {
    private String lote;
    private LocalDate validade;
    private UUID idMedicamento;
    private String nomeMedicamento;
    private String formaFarmaceutica;
    private String viaDeAdministracao;
    private String concentracao;
    private String categoriaTerapeutica;
    private Long estoqueMinimo;
    private Long estoqueMaximo;
    private Long quantidadeTotalEstoque;

    public static MedicamentoEstoqueDTOListar fromEntity(Medicamento medicamento) {
        MedicamentoEstoqueDTOListar dto = new MedicamentoEstoqueDTOListar();
        Optional<Estoque> primeiroEstoque = medicamento.getEstoques().stream().findFirst();

        if (primeiroEstoque.isPresent()) {
            Estoque estoque = primeiroEstoque.get();
            dto.setLote(estoque.getLote());
            dto.setValidade(estoque.getValidadeAposAberto());
        }

        dto.setIdMedicamento(medicamento.getId());
        dto.setNomeMedicamento(medicamento.getNome());
        dto.setFormaFarmaceutica(medicamento.getFormaFarmaceutica());
        dto.setViaDeAdministracao(medicamento.getViaDeAdministracao());
        dto.setConcentracao(medicamento.getConcentracao());
        dto.setCategoriaTerapeutica(medicamento.getCategoriaTerapeutica());
        dto.setEstoqueMinimo(medicamento.getEstoqueMinimo());
        dto.setEstoqueMaximo(medicamento.getEstoqueMaximo());
        // Soma total de quantidade em todos os estoques associados
        long total = medicamento.getEstoques().stream()
                .mapToLong(e -> e.getQuantidade() != null ? e.getQuantidade() : 0L)
                .sum();
        dto.setQuantidadeTotalEstoque(total);

        return dto;
    }
}