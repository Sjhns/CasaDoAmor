import './styles/MedicationFormModal.css';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
/*
    IMPORTS DAS FERRAMENTAS UTILIZADAS
*/ 

/*
    CRIAÇÃO DO FORMULÁRIO USANDO O HOOK FORM E ZOD COMO RESOLVER
*/ 
const formSchema = z.object({
    nomeCaixa: z.string(). min(1, 'Este campo é obrigatório'),
    nomeGenerico: z.string(). min(1, 'Este campo é obrigatório'),
    apelido: z.string().optional(),
    codigo: z.string(). min(1, 'Este campo é obrigatório'),
    descricao: z.string().optional(),
    lote: z.string(). min(1, 'Este campo é obrigatório'),
    validade: z.coerce.date(),
});

type FormData = z.infer<typeof formSchema>;

/*
    FUNCOES DO COMPONENTE
*/
const MedicationFormModal = () => {
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema) as Resolver<FormData>
    });

    /*
        O QUE ELE FAZ QUANDO É ENVIADO (por enquanto por motivos de teste, escreveremos no log do console)
    */

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log('DADOS VÁLIDOS:', data);
        alert('Formulário enviado com sucesso! Veja o console (F12).');
    };

    /*
        ESTRUTURA BASE HTML
    */

    return (
        <div className = 'modal-backdrop'>
            <div className = 'modal-content'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label>Nome da Caixa</label>
                        <input type="text" {...register('nomeCaixa')}/>
                        {errors.nomeCaixa && <p style={{color: 'red'}}>{errors.nomeCaixa.message}</p>}
                    </div>
                    <div>
                        <label>Nome Genérico</label>
                        <input type="text" {...register('nomeGenerico')}/>
                        {errors.nomeGenerico && <p style={{color: 'red'}}>{errors.nomeGenerico.message}</p>}
                    </div>
                    <div>
                        <label>Apelido</label>
                        <input type="text" {...register('apelido')}/>
                    </div>
                    <div>
                        <label>Código</label>
                        <input type="text" {...register('codigo')}/>
                        {errors.codigo && <p style={{color: 'red'}}>{errors.codigo.message}</p>}
                    </div>
                    <div>
                        <label>Validade</label>
                        <input type="date" {...register('validade')}/>
                        {errors.validade && <p style={{color: 'red'}}>{errors.validade.message}</p>}
                    </div>
                    <div>
                        <label>Lote</label>
                        <input type="text" {...register('lote')}/>
                        {errors.lote && <p style={{color: 'red'}}>{errors.lote.message}</p>}
                    </div>
                    <div>
                        <label>Descrição</label>
                        <input type="text" {...register('descricao')}/>
                    </div>
                    <button type="submit">Enviar Formulário</button>
                </form>
            </div>
        </div>
    );
};

export default MedicationFormModal;