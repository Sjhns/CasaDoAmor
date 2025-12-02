package com.casaDoAmor.CasaDoAmor.controller;

import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import com.casaDoAmor.CasaDoAmor.service.DenominacaoGenericaService;
import com.casaDoAmor.CasaDoAmor.dtoCriar.DenominacaoGenericaDTOCriar;
import com.casaDoAmor.CasaDoAmor.dtoListar.DenominacaoGenericaDTOListar;
import com.casaDoAmor.CasaDoAmor.dtoResposta.DenominacaoGenericaDTOResposta;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/denominacao-generica")
public class DenominacaoGenericaController {

    private final DenominacaoGenericaService service;

    public DenominacaoGenericaController(DenominacaoGenericaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DenominacaoGenericaDTOResposta> criar(@Valid @RequestBody DenominacaoGenericaDTOCriar dto) {
        DenominacaoGenerica novaDenominacaoGenericaSalva = service.salvar(dto);
        DenominacaoGenericaDTOResposta dtoResposta = DenominacaoGenericaDTOResposta
                .fromEntity(novaDenominacaoGenericaSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(dtoResposta);
    }

    @GetMapping
    public ResponseEntity<List<DenominacaoGenericaDTOListar>> listar() {
        List<DenominacaoGenerica> entidades = service.listarTodos();
        List<DenominacaoGenericaDTOListar> dtosListar = entidades.stream()
                .map(DenominacaoGenericaDTOListar::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtosListar);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable java.util.UUID id) {
        DenominacaoGenerica entidade = service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Denominação Genérica não encontrada com ID: " + id));
        service.deletar(entidade);
        return ResponseEntity.noContent().build();
    }
}