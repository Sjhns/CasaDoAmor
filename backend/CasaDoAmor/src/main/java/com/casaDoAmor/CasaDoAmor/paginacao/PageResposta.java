package com.casaDoAmor.CasaDoAmor.paginacao;

import lombok.Data;
import lombok.AllArgsConstructor; // Opcional, mas útil
import lombok.NoArgsConstructor;   // Opcional, mas útil
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResposta <T> {
    private long totalRegistrosEncontrados; 
    private int paginaAtual;   
    private int quantidadeItensSolicitados; 
    private List<T> itens;
}
