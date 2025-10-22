package com.casaDoAmor.CasaDoAmor.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;
import lombok.Data;

@Data
@Entity
public class Local {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID identificador;
    private String nome;
}
