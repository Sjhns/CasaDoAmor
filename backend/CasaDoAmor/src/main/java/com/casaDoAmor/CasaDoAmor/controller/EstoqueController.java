package com.casaDoAmor.CasaDoAmor.controller;

import java.util.stream.Collectors;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.casaDoAmor.CasaDoAmor.dtoCriar.EstoqueDTOCriar;
import com.casaDoAmor.CasaDoAmor.dtoListar.EstoqueDTOListar; 
import com.casaDoAmor.CasaDoAmor.dtoResposta.EstoqueDTOResposta; 
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.service.EstoqueService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/estoque")
public class EstoqueController {
    private final EstoqueService estoqueService;
    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }
    @PostMapping
    public ResponseEntity<EstoqueDTOResposta> salvar(@Valid @RequestBody EstoqueDTOCriar dto) { 
        Estoque novoEstoqueSalvo = estoqueService.salvar(dto); 
        EstoqueDTOResposta dtoResposta = EstoqueDTOResposta.fromEntity(novoEstoqueSalvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(dtoResposta);
    }
    @GetMapping
    public ResponseEntity<List<EstoqueDTOListar>> listar() { 
        List<Estoque> entidades = estoqueService.listarTodos();
        List<EstoqueDTOListar> dtosListar = entidades.stream()
            .map(EstoqueDTOListar::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtosListar);
    }
}