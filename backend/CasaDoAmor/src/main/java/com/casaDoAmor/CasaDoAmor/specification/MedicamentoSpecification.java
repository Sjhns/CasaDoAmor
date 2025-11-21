package com.casaDoAmor.CasaDoAmor.specification;

import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType; 
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class MedicamentoSpecification {
    public static Specification<Medicamento> buscarPorTermo(String termoBusca) {
        if (termoBusca == null || termoBusca.isBlank()) {
            return (root, query, criteriaBuilder) -> null; 
        }
        String termoLowerCase = "%" + termoBusca.toLowerCase() + "%";
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); 
            Join<Medicamento, Estoque> estoqueJoin = root.join("estoques", JoinType.LEFT); 
            Predicate nomeMedicamentoMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("nome")), termoLowerCase);
            Predicate loteMatch = criteriaBuilder.like(criteriaBuilder.lower(estoqueJoin.get("lote")), termoLowerCase);
            Predicate concentracaoMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("concentracao")), termoLowerCase);
            Predicate categoriaTerapeuticaMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("categoriaTerapeutica")), termoLowerCase);
            return criteriaBuilder.or(nomeMedicamentoMatch, loteMatch, concentracaoMatch,categoriaTerapeuticaMatch);
        };
    }
}