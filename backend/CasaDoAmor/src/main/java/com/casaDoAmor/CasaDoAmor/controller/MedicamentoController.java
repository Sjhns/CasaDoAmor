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
import com.casaDoAmor.CasaDoAmor.dtoAtualizar.MovimentarEstoqueDTOAtualizar;
import com.casaDoAmor.CasaDoAmor.dtoCriar.MedicamentoDTOCriar;
import com.casaDoAmor.CasaDoAmor.dtoListar.MedicamentoDTOListar;
import com.casaDoAmor.CasaDoAmor.dtoResposta.EstoqueDTOResposta;
import com.casaDoAmor.CasaDoAmor.dtoResposta.MedicamentoDTOResposta;
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
    @PostMapping
    public ResponseEntity<MedicamentoDTOResposta> salvar(@Valid @RequestBody MedicamentoDTOCriar dto) { 
        Medicamento novoMedicamentoSalvo = medicamentoService.salvar(dto);
        MedicamentoDTOResposta responseDTO = MedicamentoDTOResposta.fromEntity(novoMedicamentoSalvo); 
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    @PostMapping("/{estoqueId}/movimentar") 
    public ResponseEntity<EstoqueDTOResposta> movimentarEstoque(@PathVariable(value = "estoqueId") UUID estoqueId, @RequestBody @Valid MovimentarEstoqueDTOAtualizar dto) { 
        Estoque estoqueAtualizado = medicamentoService.movimentarEstoque(estoqueId, dto);
        if (estoqueAtualizado == null) {
            return ResponseEntity.noContent().build(); 
        }
        EstoqueDTOResposta responseDTO = EstoqueDTOResposta.fromEntity(estoqueAtualizado);
        return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
    }
    @GetMapping
    public ResponseEntity<List<MedicamentoDTOListar>> listar() {
        List<Medicamento> entidades = medicamentoService.listarTodos();
        List<MedicamentoDTOListar> dtosListar = entidades.stream()
            .map(MedicamentoDTOListar::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtosListar);
    }
}
