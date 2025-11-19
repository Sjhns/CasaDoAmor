// 1. O 'import styles' foi removido. Não é mais necessário.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  formSchema,
  type FormData,
} from "../schemas/MedicationFormModal.schema"; //
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { useState } from "react";
import ErrorModal from "../components/ErrorModal"; 
// -----------------------------------------------------------

interface MedicationFormModalProps {
  medicationData?: FormData & { id: number | string };
  onClose: () => void;
}

const MedicationFormModal = (props: MedicationFormModalProps) => {
  const { medicationData, onClose } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema), //
    defaultValues: medicationData ? medicationData : {},
  });

  const queryClient = useQueryClient();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false); 
    setErrorMessage("");
  };
  // -------------------------------------------------------------

  const onSubmit = async (data: FormData) => {
    try {
      if (medicationData) {
        const id = medicationData.id;
        const url = `${API_URL}/medicamento/${id}`;
        const response = await axios.put(url, data);
        console.log("PUT: ", response.data);
      } else {
        const url = `${API_URL}/medicamento`;
        const response = await axios.post(url, data);
        console.log("POST: ", response.data);
      }

      await queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      onClose(); // Sucesso: fecha o modal do formulário
    } catch (error) {
      let friendlyMessage = "Erro inesperado. Tente novamente."; 

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const apiMsg = error.response?.data?.message; 
        
        friendlyMessage = `Erro ${status || ''}: ${apiMsg || 'Não foi possível conectar ao servidor.'}`;
        
        console.error(
          "Erro do servidor: ",
          error.response?.status,
          error.response?.data
        );
      } else {
        console.error("Erro do servidor: ", error);
        if (error instanceof Error) {
            friendlyMessage = error.message; 
        }
      }
      
      setErrorMessage(friendlyMessage);
      setIsErrorModalOpen(true);
      // -----------------------------------------------------------
    }
  };

return (
    <>
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        {medicationData ? "Editar Medicamento" : "Adicionar Medicamento"}
                    </h2>
                </div>

                {/* Form Content (COM OS CAMPOS ATUALIZADOS) */}
                <div className="overflow-y-auto flex-1 px-6 py-4">
                    {/* */}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} id="medication-form">

                        {/* Nome */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="nome" className="font-medium text-sm text-gray-700">
                                Nome
                            </label>
                            <input
                                id="nome"
                                type="text"
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Digite o nome"
                                {...register("nome")} /* */
                            />
                            {errors.nome && (
                                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.nome.message}
                                </p>
                            )}
                        </div>

                        {/* Nome Genérico */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="nomeGenerico" className="font-medium text-sm text-gray-700">
                                Nome Genérico
                            </label>
                            <input
                                id="nomeGenerico"
                                type="text"
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Digite o nome genérico"
                                {...register("nomeGenerico")} /* */
                            />
                            {errors.nomeGenerico && (
                                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.nomeGenerico.message}
                                </p>
                            )}
                        </div>
                        
                        {/* Forma Farmacêutica */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="formaFarmaceutica" className="font-medium text-sm text-gray-700">
                                Forma Farmacêutica
                            </label>
                            <input
                                id="formaFarmaceutica"
                                type="text"
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Ex: Comprimido, Xarope, Injetável..."
                                {...register("formaFarmaceutica")} /* */
                            />
                            {errors.formaFarmaceutica && (
                                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.formaFarmaceutica.message}
                                </p>
                            )}
                        </div>

                        {/* Linha: Categoria / Laboratório */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="categoria" className="font-medium text-sm text-gray-700">
                                    Categoria
                                </label>
                                <input
                                    id="categoria"
                                    type="text"
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Ex: Analgésico"
                                    {...register("categoria")} /* */
                                />
                                {errors.categoria && (
                                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                        <span>⚠</span> {errors.categoria.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="laboratorio" className="font-medium text-sm text-gray-700">
                                    Laboratório
                                </label>
                                <input
                                    id="laboratorio"
                                    type="text"
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Ex: Pfizer, Bayer"
                                    {...register("laboratorio")} /* */
                                />
                                {errors.laboratorio && (
                                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                        <span>⚠</span> {errors.laboratorio.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Linha: Via de Administração / Concentração */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="viaAdministracao" className="font-medium text-sm text-gray-700">
                                    Via de Administração
                                </label>
                                <input
                                    id="viaAdministracao"
                                    type="text"
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Ex: Oral, Intravenosa"
                                    {...register("viaAdministracao")} /* */
                                />
                                {errors.viaAdministracao && (
                                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                        <span>⚠</span> {errors.viaAdministracao.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="concentracao" className="font-medium text-sm text-gray-700">
                                    Concentração
                                </label>
                                <input
                                    id="concentracao"
                                    type="text"
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Ex: 500mg, 10mg/mL"
                                    {...register("concentracao")} /* */
                                />
                                {errors.concentracao && (
                                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                        <span>⚠</span> {errors.concentracao.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Linha: Quantidade Mínima / Quantidade Máxima */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="quantidadeMinima" className="font-medium text-sm text-gray-700">
                                    Quantidade mínima
                                </label>
                                <input
                                    id="quantidadeMinima"
                                    type="number"
                                    min="0"
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="0"
                                    {...register("quantidadeMinima")} /* */
                                />
                                {errors.quantidadeMinima && (
                                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                        <span>⚠</span> {errors.quantidadeMinima.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="quantidadeMaxima" className="font-medium text-sm text-gray-700">
                                    Quantidade Máxima
                                </label>
                                <input
                                    id="quantidadeMaxima"
                                    type="number"
                                    min="0"
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="100"
                                    /* */
                                    {...register("quantidadeMaxima")} /* <-- ATENÇÃO AO ACENTO */
                                />
                                {errors.quantidadeMaxima && ( /* */
                                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                        <span>⚠</span> {errors.quantidadeMaxima.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer (Botões) */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
                    <button
                        type="button"
                        className="px-6 py-2.5 rounded-lg font-medium text-sm text-white bg-red-600 border border-white hover:opacity-90"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="medication-form"
                        className="px-6 py-2.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {medicationData ? "Salvar Alterações" : "Adicionar Medicamento"}
                    </button>
                </div>
            </div>
        </div>

        <ErrorModal 
            isOpen={isErrorModalOpen}
            onClose={handleErrorModalClose}
            message={errorMessage}
        />
    </>
);
};

export default MedicationFormModal;