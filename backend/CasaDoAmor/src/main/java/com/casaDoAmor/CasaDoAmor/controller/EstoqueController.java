package com.casaDoAmor.CasaDoAmor.controller;

import java.util.stream.Collectors;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.casaDoAmor.CasaDoAmor.dtoCriar.EstoqueDTOCriar;
import com.casaDoAmor.CasaDoAmor.dtoCriar.DespachoDTOCriar;
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

    // --- SEU NOVO ENDPOINT AQUI ---
    @PostMapping("/despacho")
    public ResponseEntity<Void> realizarDespacho(@RequestBody DespachoDTOCriar dados) {
        // Você vai precisar criar esse método 'realizarDespacho' no seu Service também!
        estoqueService.realizarDespacho(dados);
        return ResponseEntity.ok().build();
    }
    // -----------------------------

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable java.util.UUID id) {
        Estoque estoque = estoqueService.listarTodos().stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado com ID: " + id));
        estoqueService.deletar(estoque);
        return ResponseEntity.noContent().build();
    }
}