package com.casaDoAmor.CasaDoAmor.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Doador {
    @Id
    private String CPF_CNPJ;
    private String nome;
    private String telefone;
    private String email;
}
