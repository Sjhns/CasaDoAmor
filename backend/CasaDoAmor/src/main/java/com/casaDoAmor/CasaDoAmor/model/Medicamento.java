package com.casaDoAmor.CasaDoAmor.model;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;
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

    @OneToOne(mappedBy = "medicamento")
    private Estoque estoque;
}