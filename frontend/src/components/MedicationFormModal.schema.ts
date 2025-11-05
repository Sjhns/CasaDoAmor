import { z } from 'zod';

export const formSchema = z.object({
    nome: z.string(). min(1, 'Este campo é obrigatório'),
    nomeGenerico: z.string(). min(1, 'Este campo é obrigatório'),
    apelido: z.string().optional(),
    codigo: z.string().min(1, 'Este campo é obrigatório'),
    descricao: z.string().optional(),
    lote: z.string().min(1, 'Este campo é obrigatório'),
    validade: z.string().min(1, 'Por favor insira uma data válida'),
});

export type FormData = z.infer<typeof formSchema>;