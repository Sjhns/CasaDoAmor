package com.casaDoAmor.CasaDoAmor.dtoResposta;

import com.casaDoAmor.CasaDoAmor.model.Doador;
import lombok.Data;
import java.util.UUID;

@Data
public class DoadorDTOResposta {
    private UUID id;
    private String nome;
    private String cpfCnpj;
    private String email;
    private String telefone;
    public static DoadorDTOResposta fromEntity(Doador entidade) {
        DoadorDTOResposta dto = new DoadorDTOResposta();
        dto.setId(entidade.getId());
        dto.setCpfCnpj(entidade.getCpfCnpj());
        dto.setNome(entidade.getNome());
        dto.setEmail(entidade.getEmail());
        dto.setTelefone(entidade.getTelefone());
        return dto;
    }
}