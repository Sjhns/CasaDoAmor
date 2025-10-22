package com.casaDoAmor.CasaDoAmor.model;

import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
public class Usuario {
    private String nome;
    private String cargo;
}
