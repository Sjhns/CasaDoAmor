import { z } from 'zod';

export const formSchema = z.object({
    nome: z.string().min(1, 'Este campo é obrigatório'),
    nomeGenerico: z.string().min(1, 'Este campo é obrigatório'),
    formaFarmaceutica: z.string().min(1, 'Este campo é obrigatório'),
    categoria: z.string().min(1, 'Este campo é obrigatório'),
    laboratorio: z.string().min(1, 'Este campo é obrigatório'),
    viaAdministracao: z.string().min(1, 'Este campo é obrigatório'),
    concentracao: z.string().min(1, 'Este campo é obrigatório'),
    quantidadeMinima: z.string().min(1, 'Este campo é obrigatório'),
    quantidadeMaxima: z.string().min(1, 'Este campo é obrigatório'),
});

export type FormData = z.infer<typeof formSchema>;