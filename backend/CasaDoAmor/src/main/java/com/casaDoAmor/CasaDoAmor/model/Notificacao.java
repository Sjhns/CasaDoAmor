package com.CasaDoAmor.CasaDoAmor.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipoAlerta;
    private String mensagem;
    private LocalDateTime dataCriacao;

    @Column(columnDefinition = "boolean default false")
    private boolean lida = false;
}
