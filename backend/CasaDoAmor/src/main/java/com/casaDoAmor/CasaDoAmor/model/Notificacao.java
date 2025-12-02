package com.casaDoAmor.CasaDoAmor.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipoAlerta;
    private String mensagem;
    private String nomeMedicamento;
    private LocalDateTime dataVencimento;
    private Integer quantidade;
    private LocalDateTime dataCriacao;

    @Column(columnDefinition = "boolean default false")
    private boolean lida = false;
}
