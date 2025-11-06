package com.casaDoAmor.CasaDoAmor.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Data;

@Data
@Entity
public class Estoque {
    @Id
    private UUID id;
    private Long quantidade;
    private Long estoqueMinimo;
    private Long estoqueMaximo;
    private String status;
    private String lote;
    private LocalDate validadeAposAberto;

    @OneToOne
    @MapsId
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;
}