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

import com.casaDoAmor.CasaDoAmor.dtoRequest.UsuarioDTORequest;
import com.casaDoAmor.CasaDoAmor.dtoResponse.UsuarioDTOResponse;
import com.casaDoAmor.CasaDoAmor.model.Usuario;
import com.casaDoAmor.CasaDoAmor.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    UsuarioService usuarioService;
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    private Usuario paraModel(UsuarioDTORequest dto) {
        Usuario entidade = new Usuario();
        entidade.setId(dto.getId());
        entidade.setNome(dto.getNome());
        entidade.setCargo(dto.getCargo());
        return entidade;
    }
    @PostMapping
    public ResponseEntity<UsuarioDTOResponse> salvar(@RequestBody UsuarioDTORequest dto) {
        Usuario entidadeParaSerSalva = paraModel(dto); 
        Usuario entidadeSalva = usuarioService.salvar(entidadeParaSerSalva);
        UsuarioDTOResponse responseDTO = UsuarioDTOResponse.fromEntity(entidadeSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    
    @GetMapping
    public ResponseEntity<List<UsuarioDTOResponse>> listar() {
        List<Usuario> entidades = usuarioService.listarTodos();
        List<UsuarioDTOResponse> usuarios = entidades.stream()
            .map(UsuarioDTOResponse::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(usuarios);
    }
}
