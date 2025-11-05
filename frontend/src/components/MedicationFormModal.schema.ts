import { z } from 'zod';

// 1. O schema é exportado daqui agora
export const formSchema = z.object({
    nomeCaixa: z.string(). min(1, 'Este campo é obrigatório'),
    nomeGenerico: z.string(). min(1, 'Este campo é obrigatório'),
    apelido: z.string().optional(),
    codigo: z.string().min(1, 'Este campo é obrigatório'),
    descricao: z.string().optional(),
    lote: z.string().min(1, 'Este campo é obrigatório'),
    validade: z.string().min(1, 'Por favor insira uma data válida'),
});

// 2. O tipo também é exportado daqui
export type FormData = z.infer<typeof formSchema>;