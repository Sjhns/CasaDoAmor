import { z } from 'zod';

export const formSchema = z.object({
    nome: z.string().min(1, 'Este campo é obrigatório'),
    denominacaoGenericaId: z.string().min(1, 'Este campo é obrigatório'),
    formaFarmaceutica: z.string().min(1, 'Este campo é obrigatório'),
    categoriaTerapeutica: z.string().min(1, 'Este campo é obrigatório'),
    laboratorioFabricante: z.string().min(1, 'Este campo é obrigatório'),
    viaDeAdministracao: z.string().min(1, 'Este campo é obrigatório'),
    concentracao: z.string().min(1, 'Este campo é obrigatório'),
    estoqueMinimo: z.string().min(1, 'Este campo é obrigatório'),
    estoqueMaximo: z.string().min(1, 'Este campo é obrigatório'),
});

export type FormData = z.infer<typeof formSchema>;