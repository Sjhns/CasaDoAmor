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
import com.casaDoAmor.CasaDoAmor.dto.DenominacaoGenericaDTO;
import com.casaDoAmor.CasaDoAmor.model.DenominacaoGenerica;
import com.casaDoAmor.CasaDoAmor.service.DenominacaoGenericaService;

@RestController
@RequestMapping("/denominacaoGenerica")
public class DenominacaoGenericaController {
    private final DenominacaoGenericaService denominacaoGenericaService;
    public DenominacaoGenericaController(DenominacaoGenericaService denominacaoGenericaService) {
        this.denominacaoGenericaService = denominacaoGenericaService;
    }
    private DenominacaoGenerica paraModel(DenominacaoGenericaDTO dto) {
        DenominacaoGenerica entidade = new DenominacaoGenerica();
        entidade.setId(dto.getId()); 
        entidade.setNome(dto.getNome());
        return entidade;
    }
    private DenominacaoGenericaDTO paraDTO(DenominacaoGenerica entidade) {
        DenominacaoGenericaDTO dto = new DenominacaoGenericaDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        return dto;
    }
    @PostMapping
    public ResponseEntity<DenominacaoGenericaDTO> salvar(@RequestBody DenominacaoGenericaDTO dto) {
        DenominacaoGenerica entidadeParaSerSalva = paraModel(dto); 
        DenominacaoGenerica entidadeSalva = denominacaoGenericaService.salvar(entidadeParaSerSalva);
        return ResponseEntity.status(HttpStatus.CREATED).body(paraDTO(entidadeSalva));
    }
    @GetMapping
    public ResponseEntity<List<DenominacaoGenericaDTO>> listar() {
        List<DenominacaoGenerica> entidades = denominacaoGenericaService.listarTodos();
        List<DenominacaoGenericaDTO> denominacoes = entidades.stream()
            .map(this::paraDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(denominacoes);
    }
}
