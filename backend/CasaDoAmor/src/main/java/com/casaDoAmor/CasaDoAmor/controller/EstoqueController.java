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

import com.casaDoAmor.CasaDoAmor.dtoRequest.EstoqueDTORequest;
import com.casaDoAmor.CasaDoAmor.dtoResponse.EstoqueDTOResponse;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.service.EstoqueService;

@RestController
@RequestMapping("/estoque")
public class EstoqueController {
    EstoqueService estoqueService;
    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }
    private Estoque paraModel(EstoqueDTORequest dto) {
        Estoque entidade = new Estoque();
        entidade.setId(dto.getId());
        entidade.setQuantidade(dto.getQuantidade());
        entidade.setEstoqueMinimo(dto.getEstoqueMinimo());
        entidade.setEstoqueMaximo(dto.getEstoqueMaximo());
        entidade.setStatus(dto.getStatus());
        entidade.setLote(dto.getLote());
        entidade.setValidadeAposAberto(dto.getValidadeAposAberto());
        return entidade;
    }
    @PostMapping
	public ResponseEntity<EstoqueDTOResponse> salvar(@RequestBody EstoqueDTORequest dto) {
		Estoque entidadeParaSerSalva = paraModel(dto); 
		Estoque entidadeSalva = estoqueService.salvar(entidadeParaSerSalva);
        EstoqueDTOResponse responseDTO = EstoqueDTOResponse.fromEntity(entidadeSalva);
		return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
	}
	@GetMapping
	public ResponseEntity<List<EstoqueDTOResponse>> listar() {
		List<Estoque> entidades = estoqueService.listarTodos();
		List<EstoqueDTOResponse> itens = entidades.stream()
			.map(EstoqueDTOResponse::fromEntity)
			.collect(Collectors.toList());
		return ResponseEntity.ok(itens);
	}
}
