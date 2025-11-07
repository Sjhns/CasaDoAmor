package com.casaDoAmor.CasaDoAmor.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casaDoAmor.CasaDoAmor.dtoRequest.LocalDTORequest;
import com.casaDoAmor.CasaDoAmor.dtoResponse.LocalDTOResponse;
import com.casaDoAmor.CasaDoAmor.model.Local;
import com.casaDoAmor.CasaDoAmor.service.LocalService;

@RestController
@RequestMapping("/local")
public class LocalController {
    LocalService localService;
    public LocalController(LocalService localService) {
        this.localService = localService;
    }
    private Local paraModel(LocalDTORequest dto) {
        Local entidade = new Local();
        entidade.setId(dto.getId());
        entidade.setNome(dto.getNome());
        return entidade;
    }
    @PostMapping
    public ResponseEntity<LocalDTOResponse> salvar(@RequestBody LocalDTORequest dto) {
        Local entidadeParaSerSalva = paraModel(dto); 
        Local entidadeSalva = localService.salvar(entidadeParaSerSalva);
        LocalDTOResponse responseDTO = LocalDTOResponse.fromEntity(entidadeSalva); 
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    @GetMapping
    public ResponseEntity<List<LocalDTOResponse>> listar() {
        List<Local> entidades = localService.listarTodos();
        List<LocalDTOResponse> locais = entidades.stream()
            .map(LocalDTOResponse::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(locais);
    }
}
