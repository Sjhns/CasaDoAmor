package com.casaDoAmor.CasaDoAmor.controller;

import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.casaDoAmor.CasaDoAmor.dtoAtualizar.MovimentarEstoqueDTOAtualizar;
import com.casaDoAmor.CasaDoAmor.dtoCriar.MedicamentoDTOCriar;
import com.casaDoAmor.CasaDoAmor.dtoAtualizar.MedicamentoDTOAtualizar;
import com.casaDoAmor.CasaDoAmor.dtoListar.MedicamentoEstoqueDTOListar;
import com.casaDoAmor.CasaDoAmor.dtoResposta.EstoqueDTOResposta;
import com.casaDoAmor.CasaDoAmor.dtoResposta.MedicamentoDTOResposta;
import com.casaDoAmor.CasaDoAmor.model.Estoque;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import com.casaDoAmor.CasaDoAmor.paginacao.PageResposta;
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
    public ResponseEntity<EstoqueDTOResposta> movimentarEstoque(@PathVariable(value = "estoqueId") UUID estoqueId,
            @RequestBody @Valid MovimentarEstoqueDTOAtualizar dto) {
        Estoque estoqueAtualizado = medicamentoService.movimentarEstoque(estoqueId, dto);
        if (estoqueAtualizado == null) {
            return ResponseEntity.noContent().build();
        }
        EstoqueDTOResposta responseDTO = EstoqueDTOResposta.fromEntity(estoqueAtualizado);
        return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
    }

    @GetMapping
    public PageResposta<MedicamentoEstoqueDTOListar> listarPaginado(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int per_page, @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "nome") String sort_by, @RequestParam(defaultValue = "asc") String sort_dir) {
        return medicamentoService.listarPaginado(page, per_page, search, sort_by, sort_dir);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoDTOResposta> buscarPorId(@PathVariable UUID id) {
        Medicamento entidade = medicamentoService.buscarPorId(id);
        MedicamentoDTOResposta dto = MedicamentoDTOResposta.fromEntity(entidade);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicamentoDTOResposta> atualizar(@PathVariable UUID id,
            @Valid @RequestBody MedicamentoDTOAtualizar dto) {
        Medicamento atualizado = medicamentoService.atualizar(id, dto);
        MedicamentoDTOResposta response = MedicamentoDTOResposta.fromEntity(atualizado);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        Medicamento medicamento = medicamentoService.buscarPorId(id);
        medicamentoService.deletar(medicamento);
        return ResponseEntity.noContent().build();
    }
}
