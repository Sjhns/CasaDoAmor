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

import com.casaDoAmor.CasaDoAmor.dtoAtualizar.DoadorDTOAtualizar;
import com.casaDoAmor.CasaDoAmor.dtoResposta.DoadorDTOResposta;
import com.casaDoAmor.CasaDoAmor.model.Doador;
import com.casaDoAmor.CasaDoAmor.service.DoadorService;

@RestController
@RequestMapping("/doador")
public class DoadorController {
    DoadorService doadorService;
    public DoadorController(DoadorService doadorService) {
        this.doadorService = doadorService;
    }
    private Doador paraModel(DoadorDTOAtualizar dto) {
        Doador entidade = new Doador();
        entidade.setId(dto.getId());
        entidade.setCpfCnpj(dto.getCpfCnpj());
        entidade.setNome(dto.getNome());
        entidade.setEmail(dto.getEmail());
        entidade.setTelefone(dto.getTelefone());
        return entidade;
    }
    @PostMapping
    public ResponseEntity<DoadorDTOResposta> salvar(@RequestBody DoadorDTOAtualizar dto) {
        Doador entidadeParaSerSalva = paraModel(dto); 
        Doador entidadeSalva = doadorService.salvar(entidadeParaSerSalva);
        DoadorDTOResposta responseDTO = DoadorDTOResposta.fromEntity(entidadeSalva); 
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    @GetMapping
    public ResponseEntity<List<DoadorDTOResposta>> listar() {
        List<Doador> entidades = doadorService.listarTodos();
        List<DoadorDTOResposta> doadores = entidades.stream()
            .map(DoadorDTOResposta::fromEntity) 
            .collect(Collectors.toList());
        return ResponseEntity.ok(doadores);
    }
}