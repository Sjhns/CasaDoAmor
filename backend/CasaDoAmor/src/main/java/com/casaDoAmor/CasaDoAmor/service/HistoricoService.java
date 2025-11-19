package com.casaDoAmor.CasaDoAmor.service;

import com.casaDoAmor.CasaDoAmor.dto.HistoricoResponseDTO;
import com.casaDoAmor.CasaDoAmor.model.Historico;
import com.casaDoAmor.CasaDoAmor.repository.HistoricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class HistoricoService {

    private final HistoricoRepository historicoRepository;

    public HistoricoService(HistoricoRepository historicoRepository) {
        this.historicoRepository = historicoRepository;
    }

    @Transactional(readOnly = true)
    public Page<HistoricoResponseDTO> buscarHistorico(
            LocalDateTime dataInicio,
            LocalDateTime dataFim,
            UUID usuarioId,
            UUID medicamentoId,
            String tipo,
            Pageable pageable
    ) {
        Page<Historico> paginaHistorico = historicoRepository.findByFilters(
            dataInicio, dataFim, usuarioId, medicamentoId, tipo, pageable
        );

        return paginaHistorico.map(this::paraDTO);
    }

    private HistoricoResponseDTO paraDTO(Historico entidade) {
        HistoricoResponseDTO dto = new HistoricoResponseDTO();
        dto.setIdHistorico(entidade.getId());
        dto.setDataMovimentacao(entidade.getDataMovimentacao());
        dto.setTipo(entidade.getTipo());
        dto.setObservacao(entidade.getObservacao());
        
        if (entidade.getUsuario() != null) {
            dto.setUsuarioId(entidade.getUsuario().getId());
            dto.setUsuarioNome(entidade.getUsuario().getNome());
        }
        if (entidade.getMedicamento() != null) {
            dto.setMedicamentoId(entidade.getMedicamento().getId());
            dto.setMedicamentoNome(entidade.getMedicamento().getNome());
        }
        
        return dto;
    }
}