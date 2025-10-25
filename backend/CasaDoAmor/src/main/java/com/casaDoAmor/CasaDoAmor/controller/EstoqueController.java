package com.casaDoAmor.CasaDoAmor.controller;

import java.util.stream.Collectors;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.casaDoAmor.CasaDoAmor.dto.EstoqueDTO;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.service.EstoqueService;

@RestController
@RequestMapping("/estoque")
public class EstoqueController {
    EstoqueService estoqueService;
    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }
    private Estoque paraModel(EstoqueDTO dto) {
        Estoque entidade = new Estoque();
        entidade.setId(dto.getId());
        entidade.setQuantidade(dto.getQuantidade());
        entidade.setEstoqueMinimo(dto.getEstoqueMinimo());
        entidade.setEstoqueMaximo(dto.getEstoqueMaximo());
        entidade.setStatus(dto.getStatus());
        return entidade;
    }
    
    private EstoqueDTO paraDTO(Estoque entidade) {
        EstoqueDTO dto = new EstoqueDTO();
        dto.setId(entidade.getId());
        dto.setQuantidade(entidade.getQuantidade());
        dto.setEstoqueMinimo(entidade.getEstoqueMinimo());
        dto.setEstoqueMaximo(entidade.getEstoqueMaximo());
        dto.setStatus(entidade.getStatus());
        return dto;
    }
    @PostMapping
    public ResponseEntity<EstoqueDTO> salvar(@RequestBody EstoqueDTO dto) {
        Estoque entidadeParaSerSalva = paraModel(dto); 
        Estoque entidadeSalva = estoqueService.salvar(entidadeParaSerSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(paraDTO(entidadeSalva));
    }
    @GetMapping
    public ResponseEntity<List<EstoqueDTO>> listar() {
        List<Estoque> entidades = estoqueService.listarTodos();
        List<EstoqueDTO> itens = entidades.stream()
            .map(this::paraDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(itens);
    }
}
