package com.casaDoAmor.CasaDoAmor.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;

@Data
@Entity
public class Medicamento {
    @Id 
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String nome;
    private String lote;
    private String formaFarmaceutica;
    private String viaDeAdministracao;
    private String concentracao;
    private String categoriaTerapeutica;
    private String laboratorioFabricante;
    private LocalDate validade;
}
