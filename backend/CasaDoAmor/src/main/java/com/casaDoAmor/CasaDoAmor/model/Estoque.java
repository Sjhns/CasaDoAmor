package com.casaDoAmor.CasaDoAmor.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.UUID;
import lombok.Data;

@Data
@Entity
public class Estoque {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private Long quantidade;
    private Long estoqueMinimo;
    private Long estoqueMaximo;
    private String status;
    @OneToOne
    @JoinColumn(name = "medicamento_id")
    private Medicamento medicamento;
}
