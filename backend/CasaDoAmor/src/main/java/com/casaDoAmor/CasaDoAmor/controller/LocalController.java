package com.casaDoAmor.CasaDoAmor.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casaDoAmor.CasaDoAmor.dto.LocalDTO;
import com.casaDoAmor.CasaDoAmor.model.Local;
import com.casaDoAmor.CasaDoAmor.service.LocalService;

@RestController
@RequestMapping("/local")
public class LocalController {
    LocalService localService;
    public LocalController(LocalService localService) {
        this.localService = localService;
    }
    private Local paraModel(LocalDTO dto) {
        Local entidade = new Local();
        entidade.setNome(dto.getNome());
        return entidade;
    }
    private LocalDTO paraDTO(Local entidade) {
        LocalDTO dto = new LocalDTO();
        dto.setNome(entidade.getNome());
        dto.setId(entidade.getId());
        return dto;
    }
    @PostMapping
    public ResponseEntity<UUID> salvar(@RequestBody LocalDTO dto) {
        Local entidadeParaSerSalva = paraModel(dto); 
        Local entidadeSalva = localService.salvar(entidadeParaSerSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(entidadeSalva.getId());
    }
    @GetMapping
    public ResponseEntity<List<LocalDTO>> listar() {
        List<Local> entidades = localService.listarTodos();
        List<LocalDTO> locais = entidades.stream()
            .map(this::paraDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(locais);
    }
}
