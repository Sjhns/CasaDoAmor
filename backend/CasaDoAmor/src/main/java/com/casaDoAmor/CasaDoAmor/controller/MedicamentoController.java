package com.casaDoAmor.CasaDoAmor.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casaDoAmor.CasaDoAmor.dtoRequest.MedicamentoDTORequest;
import com.casaDoAmor.CasaDoAmor.dtoRequest.MovimentarEstoqueDTORequest;
import com.casaDoAmor.CasaDoAmor.dtoResponse.EstoqueDTOResponse;
import com.casaDoAmor.CasaDoAmor.dtoResponse.MedicamentoDTOResponse;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.service.MedicamentoService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/medicamento")
public class MedicamentoController {
    MedicamentoService medicamentoService;
    public MedicamentoController(MedicamentoService medicamentoService) {
        this.medicamentoService = medicamentoService;
    }
    private Medicamento paraModel(MedicamentoDTORequest dto) {
        Medicamento entidade = new Medicamento();
        entidade.setId(dto.getId());
        entidade.setNome(dto.getNome());
        entidade.setFormaFarmaceutica(dto.getFormaFarmaceutica());
        entidade.setViaDeAdministracao(dto.getViaDeAdministracao());
        entidade.setConcentracao(dto.getConcentracao());
        entidade.setCategoriaTerapeutica(dto.getCategoriaTerapeutica());
        entidade.setLaboratorioFabricante(dto.getLaboratorioFabricante());
        return entidade;
    }
    @PostMapping
    public ResponseEntity<MedicamentoDTOResponse> salvar(@RequestBody MedicamentoDTORequest dto) {
        Medicamento entidadeParaSerSalva = paraModel(dto); 
        Medicamento entidadeSalva = medicamentoService.salvar(entidadeParaSerSalva);
        MedicamentoDTOResponse responseDTO = MedicamentoDTOResponse.fromEntity(entidadeSalva); 
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    @PostMapping("/{id}/movimentacoes") 
	public ResponseEntity<EstoqueDTOResponse> movimentarEstoque(
		@PathVariable(value = "id") UUID medicamentoId, 
		@RequestBody @Valid MovimentarEstoqueDTORequest dto) { 
		Estoque estoqueAtualizado = medicamentoService.movimentarEstoque(medicamentoId, dto);
        EstoqueDTOResponse responseDTO = EstoqueDTOResponse.fromEntity(estoqueAtualizado);
		return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
	}
    @GetMapping
    public ResponseEntity<List<MedicamentoDTOResponse>> listar() {
        List<Medicamento> entidades = medicamentoService.listarTodos();
        List<MedicamentoDTOResponse> medicamentos = entidades.stream()
            .map(MedicamentoDTOResponse::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(medicamentos);
    }   
}
