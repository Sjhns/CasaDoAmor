package com.casaDoAmor.CasaDoAmor.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "historico")
@Data
public class Historico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime dataMovimentacao;

    @Column(nullable = false)
    private String tipo; 

    @Column
    private String observacao;

    @Column(name = "usuario_nome")
    private String usuarioNome; 

    @Column(name = "medicamento_nome")
    private String medicamentoNome;

    // --- NOVO CAMPO ---
    @Column(name = "destinatario")
    private String destinatario; // Nome do Paciente ou Pessoa Externa

    @PrePersist
    protected void onCreate() {
        if (dataMovimentacao == null) {
            dataMovimentacao = LocalDateTime.now();
        }
    }
}