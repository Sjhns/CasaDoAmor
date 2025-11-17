package com.casaDoAmor.CasaDoAmor.model;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class Medicamento {
    @Id 
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String nome;
    private String formaFarmaceutica;
    private String viaDeAdministracao;
    private String concentracao;
    private String categoriaTerapeutica;
    private String laboratorioFabricante;
    private Long estoqueMinimo;
    private Long estoqueMaximo;

    @OneToMany(mappedBy = "medicamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Estoque> estoques = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "denominacao_generica_id", nullable = false) 
    private DenominacaoGenerica denominacaoGenerica;
}