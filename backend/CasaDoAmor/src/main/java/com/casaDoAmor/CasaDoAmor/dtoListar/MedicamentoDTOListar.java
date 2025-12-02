package com.casaDoAmor.CasaDoAmor.dtoListar;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.casaDoAmor.CasaDoAmor.model.Medicamento;

public record MedicamentoDTOListar(
    UUID idMedicamento,
    String nomeMedicamento,
    Long quantidadeTotalEstoque,
    String lote, 
    LocalDate validade, 
    String formaFarmaceutica,
    String categoriaTerapeutica,
    
    // --- ESTE É O CAMPO QUE FALTAVA NA TABELA ---
    List<EstoqueDTOListar> estoques 
) {
    public static MedicamentoDTOListar fromEntity(Medicamento medicamento) {
        // 1. Calcula o Total
        Long total = medicamento.getEstoques().stream()
                .mapToLong(e -> e.getQuantidade())
                .sum();

        // 2. Define dados de resumo (para a linha fechada)
        String lotePrincipal = medicamento.getEstoques().isEmpty() ? "-" : medicamento.getEstoques().get(0).getLote();
        LocalDate validadePrincipal = medicamento.getEstoques().isEmpty() ? null : medicamento.getEstoques().get(0).getValidadeAposAberto();

        // 3. Preenche a lista detalhada (para o Accordion abrir)
        List<EstoqueDTOListar> listaEstoques = medicamento.getEstoques().stream()
                .map(EstoqueDTOListar::fromEntity)
                .collect(Collectors.toList());

        return new MedicamentoDTOListar(
            medicamento.getId(),
            medicamento.getNome(),
            total,
            lotePrincipal,
            validadePrincipal,
            medicamento.getFormaFarmaceutica(),
            medicamento.getCategoriaTerapeutica(),
            listaEstoques // <--- Agora a tabela vai receber os dados!
        );
    }
}