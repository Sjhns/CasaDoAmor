import { useState, useEffect } from "react";
import { API_URL } from "../constants";
// Removido import ErrorModal pois faremos internamente

interface ModalDespachoProps {
    open: boolean;
    onClose: () => void;
    medication: {
        id: string;
        nome: string;
        estoqueAtual: number;
    } | null;
    onSuccess: () => void;
}

export default function ModalDespacho({
    open,
    onClose,
    medication,
    onSuccess,
}: ModalDespachoProps) {
    // Estados do Formulário
    const [quantidade, setQuantidade] = useState<number | "">("");
    const [paciente, setPaciente] = useState("");
    const [pessoaExterna, setPessoaExterna] = useState(false);
    const [observacao, setObservacao] = useState("");
    
    // Estados de Validação e UI
    const [errors, setErrors] = useState<{ quantidade?: string; paciente?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado de Erro Interno (Substitui o ErrorModal)
    const [errorMessage, setErrorMessage] = useState("");

    // Limpa o form ao abrir/fechar
    useEffect(() => {
        if (open) {
            setQuantidade("");
            setPaciente("");
            setPessoaExterna(false);
            setObservacao("");
            setErrors({});
            setIsSubmitting(false);
            setErrorMessage(""); // Limpa erro anterior
        }
    }, [open, medication]);

    const handleSubmit = async () => {
        setErrorMessage(""); // Limpa erro ao tentar novamente
        
        if (!medication) {
            console.error("❌ ERRO: Medication é null ou undefined.");
            return;
        }

        // --- 1. Validação ---
        const newErrors: typeof errors = {};
        
        // Regra: Quantidade Obrigatória
        if (!quantidade || Number(quantidade) <= 0) {
            newErrors.quantidade = "Informe a quantidade a ser despachada.";
        } else if (Number(quantidade) > medication.estoqueAtual) {
            newErrors.quantidade = `Estoque insuficiente (Máx: ${medication.estoqueAtual})`;
        }

        // Regra: Destinatário Obrigatório
        const temDestinatario = paciente.trim().length > 0 || pessoaExterna;
        if (!temDestinatario) {
            newErrors.paciente = "Informe o Paciente ou marque Pessoa Externa.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // --- 2. Preparação dos Dados ---
            const qtdParaEnvio = Number(quantidade);

            const payload = {
                medicamentoId: medication.id,
                quantidade: qtdParaEnvio,
                paciente: paciente,
                isPessoaExterna: pessoaExterna,
                isCartelaInteira: false, 
                observacao: observacao,
                tipoMovimentacao: "SAIDA" 
            };

            const response = await fetch(`${API_URL}/estoque/despacho`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ Erro retornado pelo Backend:", errorData);
                throw new Error(errorData.message || "Falha ao registrar saída no servidor.");
            }

            // --- 3. Verificação de Estoque Zero ---
            /* const checkResponse = await fetch(`${API_URL}/medicamento/${medication.id}`);
            if (checkResponse.ok) {
                const updatedMed = await checkResponse.json();
                const estoqueReal = updatedMed.estoqueTotal ?? updatedMed.estoqueAtual ?? 0;

                if (estoqueReal <= 0) {
                    await fetch(`${API_URL}/medicamento/${medication.id}`, {
                        method: "DELETE",
                    });
                }
            } */

            onSuccess();
            onClose();

        } catch (error) {
            console.error("🔥 EXCEPTION CATCH:", error);
            
            let msg = "Erro desconhecido ao despachar.";
            if (error instanceof Error) {
                msg = error.message;
            } else if (typeof error === "string") {
                msg = error;
            }

            // Define o erro para aparecer dentro do modal
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open || !medication) return null;

    return (
        // Voltamos para z-50 padrão, já que não temos conflito de modais
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white p-6 w-full max-w-lg rounded-xl shadow-2xl animate-fadeIn">
                <h2 className="text-2xl font-normal text-gray-900 mb-6 text-center">
                    Despachar {medication.nome}
                </h2>

                {/* --- ÁREA DE MENSAGEM DE ERRO (NOVO) --- */}
                {/* Segue o mesmo padrão do successMsg do modal de edição */}
                {errorMessage && (
                    <div className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-start justify-between gap-2">
                        <span>{errorMessage}</span>
                        <button 
                            onClick={() => setErrorMessage("")}
                            className="text-red-700 hover:text-red-900 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-5">
                    
                    {/* === QUANTIDADE === */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-800">Quantidade</label>
                        <input
                            type="number"
                            value={quantidade}
                            onChange={(e) => {
                                setQuantidade(e.target.value === "" ? "" : Number(e.target.value));
                                if (errors.quantidade) setErrors({...errors, quantidade: undefined});
                            }}
                            className={`w-full px-4 py-2 border rounded border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.quantidade ? 'border-red-500' : ''}`}
                            placeholder="Digite a quantidade a despachar"
                        />
                        {errors.quantidade && <span className="text-xs text-red-600">{errors.quantidade}</span>}
                    </div>

                    {/* === PACIENTE === */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-800">Paciente</label>
                        <input
                            type="text"
                            value={paciente}
                            onChange={(e) => {
                                setPaciente(e.target.value);
                                if (errors.paciente) setErrors({...errors, paciente: undefined});
                            }}
                            className={`w-full px-4 py-2 border rounded border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.paciente ? 'border-red-500' : ''}`}
                            placeholder="Nome do paciente"
                        />
                        {errors.paciente && <span className="text-xs text-red-600">{errors.paciente}</span>}
                    </div>

                    {/* === PESSOA EXTERNA === */}
                    <div className="flex items-center gap-2 -mt-2 select-none cursor-pointer" onClick={() => {
                        const newValue = !pessoaExterna;
                        setPessoaExterna(newValue);
                        if (newValue && errors.paciente) setErrors({...errors, paciente: undefined});
                    }}>
                        <input
                            type="checkbox"
                            checked={pessoaExterna}
                            onChange={(e) => setPessoaExterna(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label className="text-sm text-gray-800 cursor-pointer">
                            Pessoa externa
                        </label>
                    </div>

                    {/* === OBSERVAÇÃO === */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-800">Observação</label>
                        <textarea
                            rows={4}
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            className="w-full px-4 py-2 border rounded border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            placeholder="Alguma observação sobre a saída..."
                        />
                    </div>

                    {/* === BOTÕES === */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded bg-[#3B82F6] text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-70"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Enviando..." : "Despachar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}