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

import com.casaDoAmor.CasaDoAmor.dto.MedicamentoDTO;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.service.MedicamentoService;


@RestController
@RequestMapping("/medicamento")
public class MedicamentoController {
    MedicamentoService medicamentoService;
    public MedicamentoController(MedicamentoService medicamentoService) {
        this.medicamentoService = medicamentoService;
    }
    private Medicamento paraModel(MedicamentoDTO dto) {
        Medicamento entidade = new Medicamento();

        entidade.setNome(dto.getNome());
        entidade.setLote(dto.getLote());
        entidade.setFormaFarmaceutica(dto.getFormaFarmaceutica());
        entidade.setViaDeAdministracao(dto.getViaDeAdministracao());
        entidade.setConcentracao(dto.getConcentracao());
        entidade.setCategoriaTerapeutica(dto.getCategoriaTerapeutica());
        entidade.setLaboratorioFabricante(dto.getLaboratorioFabricante());
        entidade.setValidade(dto.getValidade());
        return entidade;
    }
    
    private MedicamentoDTO paraDTO(Medicamento entidade) {
        MedicamentoDTO dto = new MedicamentoDTO();
        dto.setNome(entidade.getNome());
        dto.setLote(entidade.getLote());
        dto.setFormaFarmaceutica(entidade.getFormaFarmaceutica());
        dto.setViaDeAdministracao(entidade.getViaDeAdministracao());
        dto.setConcentracao(entidade.getConcentracao());
        dto.setCategoriaTerapeutica(entidade.getCategoriaTerapeutica());
        dto.setLaboratorioFabricante(entidade.getLaboratorioFabricante());
        dto.setValidade(entidade.getValidade());
        dto.setId(entidade.getId());
        return dto;
    }
    @PostMapping
    public ResponseEntity<UUID> salvar(@RequestBody MedicamentoDTO dto) {
        Medicamento entidadeParaSerSalva = paraModel(dto); 
        Medicamento entidadeSalva = medicamentoService.salvar(entidadeParaSerSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(entidadeSalva.getId());
    }
    @GetMapping
    public ResponseEntity<List<MedicamentoDTO>> listar() {
        List<Medicamento> entidades = medicamentoService.listarTodos();
        List<MedicamentoDTO> medicamentos = entidades.stream()
            .map(this::paraDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(medicamentos);
    }
}
