import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  formSchema,
  type FormData,
} from "../schemas/MedicationFormModal.schema"; 
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { useEffect, useState } from "react";
import ErrorModal from "../components/ErrorModal";
import DenominacaoGenericaFormModal from "./DenominacaoGenericaFormModal";

interface MedicationFormModalProps {
  medicationData?: FormData & { id: string };
  onClose: () => void;
  onSuccessCreate?: (id: string) => void;
}

const MedicationFormModal = (props: MedicationFormModalProps) => {
  const { medicationData, onClose, onSuccessCreate } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: medicationData ? medicationData : {},
  });

  const queryClient = useQueryClient();
  
  // Estados de Controle de Modais
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // <--- NOVO ESTADO
  const [isDenomModalOpen, setIsDenomModalOpen] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  // --- 1. Apenas abre o modal de confirmação ---
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // --- 2. Executa a exclusão de fato (Chamado pelo Modal de Confirmação) ---
  const confirmDelete = async () => {
    if (!medicationData?.id) return;

    try {
      setIsSubmitting(true);
      await axios.delete(`${API_URL}/medicamento/${medicationData.id}`);
      
      await queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      
      setSuccessMsg("Medicamento excluído com sucesso!");
      setIsDeleteModalOpen(false); // Fecha o modal de confirmação
      
      // Fecha o modal principal após um breve delay
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);

    } catch (error) {
      setIsDeleteModalOpen(false); // Fecha o modal de confirmação se der erro
      console.error("Erro ao excluir:", error);
      let msg = "Erro ao tentar excluir o medicamento.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setErrorMessage(msg);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      if (medicationData) {
        const id = medicationData.id;
        const url = `${API_URL}/medicamento/${id}`;
        await axios.put(url, data);
      } else {
        const url = `${API_URL}/medicamento`;
        const response = await axios.post(url, data);
        const createdId = response.data.id;
        if (onSuccessCreate && createdId) {
          onSuccessCreate(createdId);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      setSuccessMsg(
        medicationData
          ? "Medicamento atualizado com sucesso!"
          : "Medicamento criado com sucesso!"
      );
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (error) {
      let friendlyMessage = "Erro inesperado. Tente novamente.";

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const apiMsg = error.response?.data?.message;

        friendlyMessage = `Erro ${status || ""}: ${apiMsg || "Não foi possível conectar ao servidor."}`;
      } else {
        if (error instanceof Error) {
          friendlyMessage = error.message;
        }
      }

      setErrorMessage(friendlyMessage);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const useDenominacoesGenericas = () => {
    const [denominacoes, setDenominacoes] = useState<Array<{ id: string; nome: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDenominacoes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/denominacao-generica`);
        setDenominacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar denominações genéricas:", error);
        setDenominacoes([]);
      } finally {
        setIsLoading(false);
      }
    };

    return { denominacoes, isLoading, fetchDenominacoes };
  };

  const { denominacoes, isLoading, fetchDenominacoes } = useDenominacoesGenericas();

  useEffect(() => {
    fetchDenominacoes();
  }, []);

  useEffect(() => {
    if (medicationData) {
      reset(medicationData);
      if (medicationData.denominacaoGenericaId) {
        setValue("denominacaoGenericaId", medicationData.denominacaoGenericaId);
      }
    }
  }, [medicationData, reset, setValue]);

  useEffect(() => {
    if (medicationData?.denominacaoGenericaId && denominacoes.length > 0) {
      setValue("denominacaoGenericaId", medicationData.denominacaoGenericaId);
    }
  }, [denominacoes, medicationData?.denominacaoGenericaId, setValue]);

  return (
    <>
      {/* MODAL PRINCIPAL DE FORMULÁRIO */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {medicationData ? "Editar Medicamento" : "Adicionar Medicamento"}
            </h2>

            {/* Botão de Excluir (Abre o modal de confirmação) */}
            {medicationData && (
              <button
                type="button"
                onClick={handleDeleteClick} // <--- Alterado para abrir o modal
                disabled={isSubmitting}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                title="Excluir medicamento"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Excluir
              </button>
            )}
          </div>

          {successMsg && (
            <div className={`mx-6 mt-3 rounded px-3 py-2 text-sm ${successMsg.includes("excluído") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {successMsg}
            </div>
          )}

          {/* Form Content */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
              id="medication-form"
            >
              {/* Nome */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nome" className="font-medium text-sm text-gray-700">Nome</label>
                <input
                  id="nome"
                  type="text"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Digite o nome"
                  {...register("nome")}
                />
                {errors.nome && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.nome.message}</p>}
              </div>

              {/* Nome Genérico */}
              <div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="denominacaoGenericaId" className="font-medium text-sm text-gray-700">Nome Genérico</label>
                  <select
                    id="denominacaoGenericaId"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("denominacaoGenericaId")}
                    disabled={isLoading}
                  >
                    <option value="">Selecione uma denominação genérica</option>
                    {denominacoes.map((denominacao) => (
                      <option key={denominacao.id} value={denominacao.id}>{denominacao.nome}</option>
                    ))}
                  </select>
                  {errors.denominacaoGenericaId && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.denominacaoGenericaId.message}</p>}
                </div>
                <button type="button" className="mt-2 text-blue-600 text-sm hover:underline pl-1" onClick={() => setIsDenomModalOpen(true)}>
                  Adicionar nova denominação genérica
                </button>
              </div>

              {/* Forma Farmacêutica */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="formaFarmaceutica" className="font-medium text-sm text-gray-700">Forma Farmacêutica</label>
                <input
                  id="formaFarmaceutica"
                  type="text"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Ex: Comprimido"
                  {...register("formaFarmaceutica")}
                />
                {errors.formaFarmaceutica && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.formaFarmaceutica.message}</p>}
              </div>

              {/* Grid Categoria/Lab */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="categoria" className="font-medium text-sm text-gray-700">Categoria</label>
                  <input
                    id="categoria"
                    type="text"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Analgésico"
                    {...register("categoriaTerapeutica")}
                  />
                  {errors.categoriaTerapeutica && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.categoriaTerapeutica.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="laboratorio" className="font-medium text-sm text-gray-700">Laboratório</label>
                  <input
                    id="laboratorio"
                    type="text"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Pfizer"
                    {...register("laboratorioFabricante")}
                  />
                  {errors.laboratorioFabricante && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.laboratorioFabricante.message}</p>}
                </div>
              </div>

              {/* Grid Via/Concentração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="viaAdministracao" className="font-medium text-sm text-gray-700">Via de Administração</label>
                  <input
                    id="viaAdministracao"
                    type="text"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Oral"
                    {...register("viaDeAdministracao")}
                  />
                  {errors.viaDeAdministracao && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.viaDeAdministracao.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="concentracao" className="font-medium text-sm text-gray-700">Concentração</label>
                  <input
                    id="concentracao"
                    type="text"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 500mg"
                    {...register("concentracao")}
                  />
                  {errors.concentracao && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.concentracao.message}</p>}
                </div>
              </div>

              {/* Grid Min/Max */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="quantidadeMinima" className="font-medium text-sm text-gray-700">Quantidade mínima</label>
                  <input
                    id="quantidadeMinima"
                    type="number"
                    min="0"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    {...register("estoqueMinimo")}
                  />
                  {errors.estoqueMinimo && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.estoqueMinimo.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="quantidadeMaxima" className="font-medium text-sm text-gray-700">Quantidade Máxima</label>
                  <input
                    id="quantidadeMaxima"
                    type="number"
                    min="0"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    {...register("estoqueMaximo")}
                  />
                  {errors.estoqueMaximo && <p className="text-red-500 text-xs mt-0.5">⚠ {errors.estoqueMaximo.message}</p>}
                </div>
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
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {medicationData ? "Salvar Alterações" : "Adicionar Medicamento"}
            </button>
          </div>
        </div>
      </div>

      {/* --- NOVO: MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      {isDeleteModalOpen && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-600 text-sm mb-6">
                Tem certeza que deseja excluir o medicamento <strong>{medicationData?.nome}</strong>? Esta ação é irreversível.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Excluindo..." : "Sim, Excluir"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outros Modais Auxiliares */}
      <DenominacaoGenericaFormModal
        isOpen={isDenomModalOpen}
        onClose={() => setIsDenomModalOpen(false)}
        onSuccess={async () => {
          await fetchDenominacoes(); 
        }}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorModalClose}
        message={errorMessage}
      />
    </>
  );
};

export default MedicationFormModal;