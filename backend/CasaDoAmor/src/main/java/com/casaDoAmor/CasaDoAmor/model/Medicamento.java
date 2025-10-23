package com.casaDoAmor.CasaDoAmor.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import java.util.UUID;
import java.util.Date;

@Data
@Entity
public class Medicamento {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;
    private String nome;
    private String lote;
    private String forma_farmaceutica;
    private String via_de_administracao;
    private String concentracao;
    private String categoria_terapeutica;
    private String laboratorio_fabricante;
    private Date validade;
}
