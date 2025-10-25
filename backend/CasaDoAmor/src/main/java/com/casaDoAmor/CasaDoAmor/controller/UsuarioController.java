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

import com.casaDoAmor.CasaDoAmor.dto.UsuarioDTO;
import com.casaDoAmor.CasaDoAmor.model.Usuario;
import com.casaDoAmor.CasaDoAmor.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    UsuarioService usuarioService;
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    private Usuario paraModel(UsuarioDTO dto) {
        Usuario entidade = new Usuario();
        entidade.setId(dto.getId());
        entidade.setNome(dto.getNome());
        entidade.setCargo(dto.getCargo());
        return entidade;
    }
    
    private UsuarioDTO paraDTO(Usuario entidade) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setCargo(entidade.getCargo());
        return dto;
    }
    @PostMapping
    public ResponseEntity<UsuarioDTO> salvar(@RequestBody UsuarioDTO dto) {
        Usuario entidadeParaSerSalva = paraModel(dto); 
        Usuario entidadeSalva = usuarioService.salvar(entidadeParaSerSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(paraDTO(entidadeSalva));
    }
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar() {
        List<Usuario> entidades = usuarioService.listarTodos();
        List<UsuarioDTO> usuarios = entidades.stream()
            .map(this::paraDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(usuarios);
    }
}
