// 1. O 'import styles' foi removido. Não é mais necessário.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  formSchema,
  type FormData,
} from "../schemas/MedicationFormModal.schema";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../constants";

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
    resolver: zodResolver(formSchema),
    defaultValues: medicationData ? medicationData : {},
  });

  const queryClient = useQueryClient();

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
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Erro ao salvar os dados. Tente novamente");
        console.error(
          "Erro do servidor: ",
          error.response?.status,
          error.response?.data
        );
      } else {
        alert("Erro ao salvar os dados. Tente novamente");
        console.error("Erro do servidor: ", error);
      }
    }
  };

return (
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

            {/* Form Content */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} id="medication-form">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="nome" className="font-medium text-sm text-gray-700">
                            Nome da Caixa <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nome"
                            type="text"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Digite o nome da caixa"
                            {...register("nome")}
                        />
                        {errors.nome && (
                            <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                <span>⚠</span> {errors.nome.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="nomeGenerico" className="font-medium text-sm text-gray-700">
                            Nome Genérico <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nomeGenerico"
                            type="text"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Digite o nome genérico"
                            {...register("nomeGenerico")}
                        />
                        {errors.nomeGenerico && (
                            <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                <span>⚠</span> {errors.nomeGenerico.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="apelido" className="font-medium text-sm text-gray-700">
                            Apelido
                        </label>
                        <input
                            id="apelido"
                            type="text"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Digite um apelido (opcional)"
                            {...register("apelido")}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="codigo" className="font-medium text-sm text-gray-700">
                            Código <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="codigo"
                            type="text"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Digite o código"
                            {...register("codigo")}
                        />
                        {errors.codigo && (
                            <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                <span>⚠</span> {errors.codigo.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="validade" className="font-medium text-sm text-gray-700">
                                Validade <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="validade"
                                type="date"
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                {...register("validade")}
                            />
                            {errors.validade && (
                                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.validade.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="lote" className="font-medium text-sm text-gray-700">
                                Lote <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="lote"
                                type="text"
                                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Digite o lote"
                                {...register("lote")}
                            />
                            {errors.lote && (
                                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.lote.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="descricao" className="font-medium text-sm text-gray-700">
                            Descrição
                        </label>
                        <textarea
                            id="descricao"
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Digite uma descrição (opcional)"
                            {...register("descricao")}
                            rows={4}
                        />
                    </div>
                </form>
            </div>

            {/* Footer */}
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
);
};

export default MedicationFormModal;
