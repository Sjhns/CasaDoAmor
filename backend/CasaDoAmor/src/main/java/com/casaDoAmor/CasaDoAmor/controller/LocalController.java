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
        entidade.setId(dto.getId());
        entidade.setNome(dto.getNome());
        return entidade;
    }
    private LocalDTO paraDTO(Local entidade) {
        LocalDTO dto = new LocalDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        return dto;
    }
    @PostMapping
    public ResponseEntity<LocalDTO> salvar(@RequestBody LocalDTO dto) {
        Local entidadeParaSerSalva = paraModel(dto); 
        Local entidadeSalva = localService.salvar(entidadeParaSerSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(paraDTO(entidadeSalva));
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
