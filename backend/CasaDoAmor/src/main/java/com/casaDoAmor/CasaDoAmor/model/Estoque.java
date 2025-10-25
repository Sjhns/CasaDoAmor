package com.casaDoAmor.CasaDoAmor.model;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;
import lombok.Data;

@Data
@Entity
public class Estoque {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private long quantidade;
    private long estoqueMinimo;
    private long estoqueMaximo;
    private String status;
}