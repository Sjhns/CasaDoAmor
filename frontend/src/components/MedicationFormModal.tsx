import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    formSchema,
    type FormData,
} from "../schemas/MedicationFormModal.schema"; //
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { useEffect, useState } from "react";
import ErrorModal from "../components/ErrorModal";

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
            } else {
                const url = `${API_URL}/medicamento`;
                const response = await axios.post(url, data);
                console.log("POST: ", response.data);

                const createdId = response.data.id;
                if (onSuccessCreate && createdId) {
                    onSuccessCreate(createdId);
                }
            }

            await queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
            onClose(); // Sucesso: fecha o modal do formulário
        } catch (error) {
            let friendlyMessage = "Erro inesperado. Tente novamente.";

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const apiMsg = error.response?.data?.message;

                friendlyMessage = `Erro ${status || ""}: ${apiMsg || "Não foi possível conectar ao servidor."}`;

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
        }
    };

    const useDenominacoesGenericas = () => {
        const [denominacoes, setDenominacoes] = useState<
            Array<{ id: string; nome: string }>
        >([]);
        const [isLoading, setIsLoading] = useState(false);

        const fetchDenominacoes = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${API_URL}/denominacao-generica`
                );
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

    const { denominacoes, isLoading, fetchDenominacoes } =
        useDenominacoesGenericas();

    useEffect(() => {
        fetchDenominacoes();
    }, []);

    // Garante que o select de Nome Genérico venha preenchido ao editar
    useEffect(() => {
        if (medicationData) {
            // Reaplica todos os valores ao abrir para edição
            reset(medicationData);
            // E garante explicitamente o campo de denominação genérica
            if (medicationData.denominacaoGenericaId) {
                setValue(
                    "denominacaoGenericaId",
                    medicationData.denominacaoGenericaId
                );
            }
        }
    }, [medicationData, reset, setValue]);

    // Após carregar as opções, assegura que o valor continue selecionado
    useEffect(() => {
        if (medicationData?.denominacaoGenericaId && denominacoes.length > 0) {
            setValue(
                "denominacaoGenericaId",
                medicationData.denominacaoGenericaId
            );
        }
    }, [denominacoes, medicationData?.denominacaoGenericaId, setValue]);

    return (
        <>
            <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            {medicationData
                                ? "Editar Medicamento"
                                : "Adicionar Medicamento"}
                        </h2>
                    </div>

                    {/* Form Content (COM OS CAMPOS ATUALIZADOS) */}
                    <div className="overflow-y-auto flex-1 px-6 py-4">
                        {/* */}
                        <form
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit(onSubmit)}
                            id="medication-form"
                        >
                            {/* Nome */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="nome"
                                    className="font-medium text-sm text-gray-700"
                                >
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
                                <label
                                    htmlFor="denominacaoGenericaId"
                                    className="font-medium text-sm text-gray-700"
                                >
                                    Nome Genérico
                                </label>
                                <select
                                    id="denominacaoGenericaId"
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    {...register("denominacaoGenericaId")}
                                    disabled={isLoading}
                                >
                                    <option value="">
                                        Selecione uma denominação genérica
                                    </option>
                                    {denominacoes.map((denominacao) => (
                                        <option
                                            key={denominacao.id}
                                            value={denominacao.id}
                                        >
                                            {denominacao.nome}
                                        </option>
                                    ))}
                                </select>
                                {errors.denominacaoGenericaId && (
                                    <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                        <span>⚠</span>{" "}
                                        {errors.denominacaoGenericaId.message}
                                    </p>
                                )}
                            </div>

                            {/* Forma Farmacêutica */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="formaFarmaceutica"
                                    className="font-medium text-sm text-gray-700"
                                >
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
                                        <span>⚠</span>{" "}
                                        {errors.formaFarmaceutica.message}
                                    </p>
                                )}
                            </div>

                            {/* Linha: Categoria / Laboratório */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="categoria"
                                        className="font-medium text-sm text-gray-700"
                                    >
                                        Categoria
                                    </label>
                                    <input
                                        id="categoria"
                                        type="text"
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ex: Analgésico"
                                        {...register(
                                            "categoriaTerapeutica"
                                        )} /* */
                                    />
                                    {errors.categoriaTerapeutica && (
                                        <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                            <span>⚠</span>{" "}
                                            {
                                                errors.categoriaTerapeutica
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="laboratorio"
                                        className="font-medium text-sm text-gray-700"
                                    >
                                        Laboratório
                                    </label>
                                    <input
                                        id="laboratorio"
                                        type="text"
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ex: Pfizer, Bayer"
                                        {...register(
                                            "laboratorioFabricante"
                                        )} /* */
                                    />
                                    {errors.laboratorioFabricante && (
                                        <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                            <span>⚠</span>{" "}
                                            {
                                                errors.laboratorioFabricante
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Linha: Via de Administração / Concentração */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="viaAdministracao"
                                        className="font-medium text-sm text-gray-700"
                                    >
                                        Via de Administração
                                    </label>
                                    <input
                                        id="viaAdministracao"
                                        type="text"
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ex: Oral, Intravenosa"
                                        {...register(
                                            "viaDeAdministracao"
                                        )} /* */
                                    />
                                    {errors.viaDeAdministracao && (
                                        <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                            <span>⚠</span>{" "}
                                            {errors.viaDeAdministracao.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="concentracao"
                                        className="font-medium text-sm text-gray-700"
                                    >
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
                                            <span>⚠</span>{" "}
                                            {errors.concentracao.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Linha: Quantidade Mínima / Quantidade Máxima */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="quantidadeMinima"
                                        className="font-medium text-sm text-gray-700"
                                    >
                                        Quantidade mínima
                                    </label>
                                    <input
                                        id="quantidadeMinima"
                                        type="number"
                                        min="0"
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="0"
                                        {...register("estoqueMinimo")} /* */
                                    />
                                    {errors.estoqueMinimo && (
                                        <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                            <span>⚠</span>{" "}
                                            {errors.estoqueMinimo.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="quantidadeMaxima"
                                        className="font-medium text-sm text-gray-700"
                                    >
                                        Quantidade Máxima
                                    </label>
                                    <input
                                        id="quantidadeMaxima"
                                        type="number"
                                        min="0"
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="100"
                                        /* */
                                        {...register(
                                            "estoqueMaximo"
                                        )} /* <-- ATENÇÃO AO ACENTO */
                                    />
                                    {errors.estoqueMaximo /* */ && (
                                        <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                                            <span>⚠</span>{" "}
                                            {errors.estoqueMaximo.message}
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
                            {medicationData
                                ? "Salvar Alterações"
                                : "Adicionar Medicamento"}
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
