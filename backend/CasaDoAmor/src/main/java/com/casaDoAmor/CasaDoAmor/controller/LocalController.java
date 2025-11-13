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

import com.casaDoAmor.CasaDoAmor.dtoAtualizar.LocalDTOAtualizar;
import com.casaDoAmor.CasaDoAmor.dtoResposta.LocalDTOResposta;
import com.casaDoAmor.CasaDoAmor.model.Local;
import com.casaDoAmor.CasaDoAmor.service.LocalService;

@RestController
@RequestMapping("/local")
public class LocalController {
    LocalService localService;
    public LocalController(LocalService localService) {
        this.localService = localService;
    }
    private Local paraModel(LocalDTOAtualizar dto) {
        Local entidade = new Local();
        entidade.setId(dto.getId());
        entidade.setNome(dto.getNome());
        return entidade;
    }
    @PostMapping
    public ResponseEntity<LocalDTOResposta> salvar(@RequestBody LocalDTOAtualizar dto) {
        Local entidadeParaSerSalva = paraModel(dto); 
        Local entidadeSalva = localService.salvar(entidadeParaSerSalva);
        LocalDTOResposta responseDTO = LocalDTOResposta.fromEntity(entidadeSalva); 
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    @GetMapping
    public ResponseEntity<List<LocalDTOResposta>> listar() {
        List<Local> entidades = localService.listarTodos();
        List<LocalDTOResposta> locais = entidades.stream()
            .map(LocalDTOResposta::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(locais);
    }
}
