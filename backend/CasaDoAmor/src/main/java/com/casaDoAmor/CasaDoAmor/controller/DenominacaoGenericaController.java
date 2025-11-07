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
import com.casaDoAmor.CasaDoAmor.dtoRequest.DenominacaoGenericaDTORequest;
import com.casaDoAmor.CasaDoAmor.dtoResponse.DenominacaoGenericaDTOResponse;
import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import com.casaDoAmor.CasaDoAmor.service.DenominacaoGenericaService;

@RestController
@RequestMapping("/denominacaoGenerica")
public class DenominacaoGenericaController {
    private final DenominacaoGenericaService denominacaoGenericaService;
    public DenominacaoGenericaController(DenominacaoGenericaService denominacaoGenericaService) {
        this.denominacaoGenericaService = denominacaoGenericaService;
    }
    private DenominacaoGenerica paraModel(DenominacaoGenericaDTORequest dto) {
        DenominacaoGenerica entidade = new DenominacaoGenerica();
        entidade.setId(dto.getId()); 
        entidade.setNome(dto.getNome());
        return entidade;
    }
    @PostMapping
    public ResponseEntity<DenominacaoGenericaDTOResponse> salvar(@RequestBody DenominacaoGenericaDTORequest dto) {
        DenominacaoGenerica entidadeParaSerSalva = paraModel(dto); 
        DenominacaoGenerica entidadeSalva = denominacaoGenericaService.salvar(entidadeParaSerSalva);
        DenominacaoGenericaDTOResponse responseDTO = DenominacaoGenericaDTOResponse.fromEntity(entidadeSalva); 
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    
    @GetMapping
    public ResponseEntity<List<DenominacaoGenericaDTOResponse>> listar() {
        List<DenominacaoGenerica> entidades = denominacaoGenericaService.listarTodos();
        List<DenominacaoGenericaDTOResponse> denominacoes = entidades.stream()
            .map(DenominacaoGenericaDTOResponse::fromEntity) 
            .collect(Collectors.toList());
        return ResponseEntity.ok(denominacoes);
    }
}
