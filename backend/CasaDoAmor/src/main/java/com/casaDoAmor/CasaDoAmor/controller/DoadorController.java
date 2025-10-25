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

import com.casaDoAmor.CasaDoAmor.dto.DoadorDTO;
import com.casaDoAmor.CasaDoAmor.model.Doador;
import com.casaDoAmor.CasaDoAmor.service.DoadorService;

@RestController
@RequestMapping("/doador")
public class DoadorController {
    DoadorService doadorService;

    public DoadorController(DoadorService doadorService) {
        this.doadorService = doadorService;
    }

    private Doador paraModel(DoadorDTO dto) {
        Doador entidade = new Doador();
        entidade.setId(dto.getId());
        entidade.setCpfCnpj(dto.getCpfCnpj());
        entidade.setNome(dto.getNome());
        entidade.setEmail(dto.getEmail());
        entidade.setTelefone(dto.getTelefone());
        return entidade;
    }
    private DoadorDTO paraDTO(Doador entidade) {
        DoadorDTO dto = new DoadorDTO();
        dto.setId(entidade.getId());
        dto.setCpfCnpj(entidade.getCpfCnpj());
        dto.setNome(entidade.getNome());
        dto.setEmail(entidade.getEmail());
        dto.setTelefone(entidade.getTelefone());
        return dto;
    }

    @PostMapping
    public ResponseEntity<DoadorDTO> salvar(@RequestBody DoadorDTO dto) {
        Doador entidadeParaSerSalva = paraModel(dto); 
        Doador entidadeSalva = doadorService.salvar(entidadeParaSerSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(paraDTO(entidadeSalva));
    }
    @GetMapping
    public ResponseEntity<List<DoadorDTO>> listar() {
        List<Doador> entidades = doadorService.listarTodos();
        List<DoadorDTO> doadores = entidades.stream()
            .map(this::paraDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(doadores);
    }
}