package com.casaDoAmor.CasaDoAmor.model;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Data;
@Data
@Entity
public class DenominacaoGenerica {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String nome;
    
    @OneToMany(mappedBy = "denominacaoGenerica", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Medicamento> medicamentos = new ArrayList<>();
}