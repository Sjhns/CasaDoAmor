package com.casaDoAmor.CasaDoAmor.controller;

import com.casaDoAmor.CasaDoAmor.dto.HistoricoResponseDTO;
import com.casaDoAmor.CasaDoAmor.service.HistoricoService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/historico") 
public class HistoricoController {

    private final HistoricoService historicoService;

    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping
    public ResponseEntity<Page<HistoricoResponseDTO>> getHistorico(
            
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            LocalDateTime dataInicio,
            
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            LocalDateTime dataFim,
            
            @RequestParam(required = false) 
            UUID usuarioId,
            
            @RequestParam(required = false) 
            UUID medicamentoId,
            
            @RequestParam(required = false) 
            String tipo,

            @PageableDefault(size = 20, sort = "dataMovimentacao", direction = Sort.Direction.DESC) 
            Pageable pageable
    ) {
        
        Page<HistoricoResponseDTO> pagina = historicoService.buscarHistorico(
            dataInicio, dataFim, usuarioId, medicamentoId, tipo, pageable
        );
        
        return ResponseEntity.ok(pagina);
    }
}