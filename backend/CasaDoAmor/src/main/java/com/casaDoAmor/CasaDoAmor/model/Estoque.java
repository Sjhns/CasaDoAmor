package com.casaDoAmor.CasaDoAmor.model;

import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Data;

@Data
@Entity
public class Estoque {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Long quantidade;
    private String status;
    private String lote;
    private LocalDate validadeAposAberto;

    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;
}
