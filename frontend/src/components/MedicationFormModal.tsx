import './styles/MedicationFormModal.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import axios from 'axios';
import { formSchema, type FormData } from './MedicationFormModal.schema';
import { useQueryClient } from '@tanstack/react-query';
/*
    IMPORTS DAS FERRAMENTAS UTILIZADAS
*/ 

interface MedicationFormModalProps {
    medicationData?: FormData & { id: number | string};
    onClose: () => void;
}

/*
    FUNCOES DO COMPONENTE
*/
const MedicationFormModal = (props: MedicationFormModalProps) => {
    const { medicationData, onClose } = props;
    const edicao = Boolean(medicationData);
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema) as Resolver<FormData>,
        defaultValues: edicao ? medicationData : {}
    });

    const queryClient = useQueryClient();

    /*
        O QUE ELE FAZ QUANDO É ENVIADO (por enquanto por motivos de teste, escreveremos no log do console)
    */

    const onSubmit = async (data: FormData) => {
        try {
            if(medicationData) {
                const id = medicationData.id;
                const url = `http://localhost:8080/medicamento/${id}`;
                const response = await axios.put(url, data);
                console.log('PUT: ', response.data)
            } else {
                const url = 'http://localhost:8080/medicamento';
                const response = await axios.post(url, data);
                console.log('POST: ', response.data)
            }

            await queryClient.invalidateQueries({queryKey: ['medicamentos']});
            onClose();
        } catch (error) {
            if(axios.isAxiosError(error)) {
                alert('Erro ao salvar os dados. Tente novamente');
                console.error('Erro do servidor: ', error.response?.status, error.response?.data);
            } else {
                alert('Erro ao salvar os dados. Tente novamente');
                console.error('Erro do servidor: ', error);
            }
        }
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