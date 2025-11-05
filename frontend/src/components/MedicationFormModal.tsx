import styles from './styles/MedicationFormModal.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { formSchema, type FormData } from './MedicationFormModal.schema';
import { useQueryClient } from '@tanstack/react-query';

interface MedicationFormModalProps {
    medicationData?: FormData & { id: number | string};
    onClose: () => void;
}

const MedicationFormModal = (props: MedicationFormModalProps) => {
    const { medicationData, onClose } = props;
    
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: medicationData ? medicationData : {}
    });

    const queryClient = useQueryClient();

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

    // Em: MedicationFormModal.tsx

    return (
    <div className={styles.modalBackdrop} onClick={onClose}>
        
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formField}>
                    <label>Nome da Caixa</label>
                    <input type="text" {...register('nome')}/>
                    {errors.nome && <p className={styles.error}>{errors.nome.message}</p>}
                </div>

                {/* E aqui */}
                <div className={styles.formField}>
                    <label>Nome Genérico</label>
                    <input type="text" {...register('nomeGenerico')}/>
                    {errors.nomeGenerico && <p className={styles.error}>{errors.nomeGenerico.message}</p>}
                </div>

                {/* E aqui */}
                <div className={styles.formField}>
                    <label>Apelido</label>
                    <input type="text" {...register('apelido')}/>
                </div>
                
                {/* E aqui */}
                <div className={styles.formField}>
                    <label>Código</label>
                    <input type="text" {...register('codigo')}/>
                    {errors.codigo && <p className={styles.error}>{errors.codigo.message}</p>}
                </div>

                <div className={styles.containerLadoALado}>

                    <div className={styles.itemLadoALado}>
                        <label>Validade</label>
                        <input type="date" {...register('validade')}/>
                        {errors.validade && <p className={styles.error}>{errors.validade.message}</p>}
                    </div>
                    
                    <div className={styles.itemLadoALado}>
                        <label>Lote</label>
                        <input type="text" {...register('lote')}/>
                        {errors.lote && <p className={styles.error}>{errors.lote.message}</p>}
                    </div>

                </div>

                <div className={styles.formField}>
                    <label>Descrição</label>
                    <textarea 
                        className={styles.descricaoTextarea} 
                        {...register('descricao')} 
                        rows={4} 
                    />
                </div>

                <div className={styles.botoesContainer}>
                    <button type="button" onClick={onClose}>Cancelar</button>
                    <button type="submit">{medicationData ? 'Editar' : 'Adicionar'}</button>
                </div>

            </form>
        </div>
    </div>
    );
};

export default MedicationFormModal;