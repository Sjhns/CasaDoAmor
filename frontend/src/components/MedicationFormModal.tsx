// 1. O 'import styles' foi removido. Não é mais necessário.
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

    // --- CLASSES DO TAILWIND APLICADAS ABAIXO ---

    return (
    // .modalBackdrop
    <div 
        className="fixed top-0 left-0 w-screen h-screen z-[100] flex justify-center items-center bg-black/20" 
        onClick={onClose}
    >
        
        {/* .modalContent */}
        <div 
            className="bg-white p-6 rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.25)] w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto z-[101]" 
            onClick={(e) => e.stopPropagation()}
        >
            
            {/* .modalContent form */}
            <form 
                className="flex flex-col gap-4" 
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* .formField */}
                <div className="flex flex-col gap-1">
                    {/* .modalContent label */}
                    <label className="font-semibold text-[0.9rem] text-[#333] text-left">Nome da Caixa</label>
                    {/* input[type="text"] */}
                    <input 
                        type="text" 
                        className="p-3 border-none rounded-lg text-base w-full box-border bg-[#e9e9e9] text-black h-10"
                        {...register('nome')}
                    />
                    {/* .error */}
                    {errors.nome && <p className="text-[#d93025] text-[0.8rem] m-0 text-left">{errors.nome.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[0.9rem] text-[#333] text-left">Nome Genérico</label>
                    <input 
                        type="text" 
                        className="p-3 border-none rounded-lg text-base w-full box-border bg-[#e9e9e9] text-black h-10"
                        {...register('nomeGenerico')}
                    />
                    {errors.nomeGenerico && <p className="text-[#d93025] text-[0.8rem] m-0 text-left">{errors.nomeGenerico.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[0.9rem] text-[#333] text-left">Apelido</label>
                    <input 
                        type="text" 
                        className="p-3 border-none rounded-lg text-base w-full box-border bg-[#e9e9e9] text-black h-10"
                        {...register('apelido')}
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[0.9rem] text-[#333] text-left">Código</label>
                    <input 
                        type="text" 
                        className="p-3 border-none rounded-lg text-base w-full box-border bg-[#e9e9e9] text-black h-10"
                        {...register('codigo')}
                    />
                    {errors.codigo && <p className="text-[#d93025] text-[0.8rem] m-0 text-left">{errors.codigo.message}</p>}
                </div>

                {/* .containerLadoALado */}
                <div className="flex flex-row gap-4">

                    {/* .itemLadoALado */}
                    <div className="flex-1 flex flex-col gap-1 box-border">
                        <label className="font-semibold text-[0.9rem] text-[#333] text-left">Validade</label>
                        {/* input[type="date"] */}
                        <input 
                            type="date" 
                            className="p-3 border-none rounded-lg text-base w-full box-border bg-[#e9e9e9] text-black h-10"
                            {...register('validade')}
                        />
                        {errors.validade && <p className="text-[#d93025] text-[0.8rem] m-0 text-left">{errors.validade.message}</p>}
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-1 box-border">
                        <label className="font-semibold text-[0.9rem] text-[#333] text-left">Lote</label>
                        <input 
                            type="text" 
                            className="p-3 border-none rounded-lg text-base w-full box-border bg-[#e9e9e9] text-black h-10"
                            {...register('lote')}
                        />
                        {errors.lote && <p className="text-[#d93025] text-[0.8rem] m-0 text-left">{errors.lote.message}</p>}
                    </div>

                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[0.9rem] text-[#333] text-left">Descrição</label>
                    {/* .descricaoTextarea */}
                    <textarea 
                        className="p-3 border-none rounded-lg text-base w-full box-border bg-[#e9e9e9] text-black font-sans resize-y min-h-20" 
                        {...register('descricao')} 
                        rows={4} 
                    />
                </div>

                {/* .botoesContainer */}
                <div className="flex flex-row justify-end gap-[150px] mt-4 border-t border-[#eee] pt-4">
                    {/* button[type="button"] */}
                    <button 
                        type="button" 
                        className="bg-[rgb(229,11,11)] text-white px-6 py-1 min-w-[175px] border border-[#ccc] rounded-md text-base cursor-pointer transition-colors duration-200 hover:bg-[rgb(182,12,12)]"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    {/* button[type="submit"] */}
                    <button 
                        type="submit" 
                        className="bg-[#007bff] text-white px-6 py-1 min-w-[175px] border-none leading-none rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0056b3]"
                    >
                        {medicationData ? 'Editar' : 'Adicionar'}
                    </button>
                </div>

            </form>
        </div>
    </div>
    );
};

export default MedicationFormModal;