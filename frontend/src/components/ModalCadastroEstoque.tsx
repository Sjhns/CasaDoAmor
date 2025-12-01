import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { API_URL } from "../constants";

interface ModalCadastroEstoqueProps {
    open: boolean;
    onClose: () => void;
    defaultMedicamentoId?: string;
}

interface Medicamento {
    idMedicamento: string;
    nomeMedicamento: string;
    concentracao: string;
    estoqueMinimo: number;
    estoqueMaximo: number;
}

interface FormEstoque {
    medicamentoId: string;
    quantidade: number | "";
    status: string;
    lote: string;
    validadeAposAberto: string;
}

export default function ModalCadastroEstoque({
    open,
    onClose,
    defaultMedicamentoId,
}: ModalCadastroEstoqueProps) {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [form, setForm] = useState<FormEstoque>({
        medicamentoId: "",
        quantidade: "",
        status: "",
        lote: "",
        validadeAposAberto: "",
    });
    const [errors, setErrors] = useState<{ quantidade?: string }>(() => ({}));
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            fetch(
                `${API_URL}/medicamento?page=1&per_page=50&sort_by=nome&sort_dir=asc`
            )
                .then((res) => res.json())
                .then(async (data) => {
                    const itens = data.itens || [];
                    setMedicamentos(itens);
                    if (defaultMedicamentoId) {
                        // seta seleção
                        setForm((prev) => ({
                            ...prev,
                            medicamentoId: defaultMedicamentoId,
                        }));
                        // se o item não estiver na lista, busca por ID e adiciona
                        const exists = itens.some(
                            (m: Medicamento) =>
                                m.idMedicamento === defaultMedicamentoId
                        );
                        if (!exists) {
                            try {
                                const resp = await fetch(
                                    `${API_URL}/medicamento/${defaultMedicamentoId}`
                                );
                                if (resp.ok) {
                                    const med = await resp.json();
                                    const mapped: Medicamento = {
                                        idMedicamento: med.id,
                                        nomeMedicamento: med.nome,
                                        concentracao: med.concentracao,
                                        estoqueMinimo: med.estoqueMinimo,
                                        estoqueMaximo: med.estoqueMaximo,
                                    };
                                    setMedicamentos((prev) => [
                                        mapped,
                                        ...prev,
                                    ]);
                                }
                            } catch (e) {
                                console.warn(
                                    "Não foi possível carregar o medicamento pré-selecionado",
                                    e
                                );
                            }
                        }
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [open, defaultMedicamentoId]);

    // Ao alterar o defaultMedicamentoId enquanto aberto, refletir no formulário
    useEffect(() => {
        if (open && defaultMedicamentoId) {
            setForm((prev) => ({
                ...prev,
                medicamentoId: defaultMedicamentoId,
            }));
        }
    }, [defaultMedicamentoId, open]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const parsedValue =
            type === "number" ? (value === "" ? "" : Number(value)) : value;
        setForm({ ...form, [name]: parsedValue } as FormEstoque);
    };

    const handleSubmit = () => {
        const med = medicamentos.find(
            (m) => m.idMedicamento === form.medicamentoId
        );
        if (!med) return;

        // Validações básicas (sem bloquear por estoque mínimo)
        if (form.quantidade === "") {
            setErrors({ quantidade: "Informe a quantidade." });
            return;
        }
        if (typeof form.quantidade === "number" && form.quantidade < 0) {
            setErrors({ quantidade: "Quantidade não pode ser negativa." });
            return;
        }
        if (
            typeof form.quantidade === "number" &&
            form.quantidade > med.estoqueMaximo
        ) {
            alert(`Quantidade acima do máximo permitido: ${med.estoqueMaximo}`);
            return;
        }
        if (
            typeof form.quantidade === "number" &&
            form.quantidade < med.estoqueMinimo
        ) {
            console.warn(
                `Quantidade abaixo do mínimo: ${form.quantidade} < ${med.estoqueMinimo}`
            );
        }

        fetch(`${API_URL}/estoque`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then(() => {
                setSuccessMsg("Estoque cadastrado com sucesso!");
                // Fecha automaticamente após breve delay
                setTimeout(() => {
                    setSuccessMsg(null);
                    onClose();
                }, 1200);
            })
            .catch((err) => console.error(err));
    };

    if (!open) return null;

    const medicamentoSelecionado = medicamentos.find(
        (m) => m.idMedicamento === form.medicamentoId
    );

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-2xl animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Cadastrar Estoque
                </h2>

                {successMsg && (
                    <div className="mb-3 rounded bg-green-50 text-green-700 px-3 py-2 text-sm">
                        {successMsg}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-medium text-sm text-gray-700">
                            Medicamento
                        </label>
                        <select
                            name="medicamentoId"
                            value={form.medicamentoId}
                            onChange={handleChange}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Selecione...</option>
                            {medicamentos.map((m) => (
                                <option
                                    key={m.idMedicamento}
                                    value={m.idMedicamento}
                                >
                                    {m.nomeMedicamento} - {m.concentracao}
                                </option>
                            ))}
                        </select>
                    </div>

                    {medicamentoSelecionado && (
                        <div className="mt-2 text-sm text-gray-600">
                            Estoque mínimo:{" "}
                            <strong>
                                {medicamentoSelecionado.estoqueMinimo}
                            </strong>{" "}
                            — Estoque máximo:{" "}
                            <strong>
                                {medicamentoSelecionado.estoqueMaximo}
                            </strong>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="font-medium text-sm text-gray-700">
                            Quantidade
                        </label>
                        <input
                            type="number"
                            name="quantidade"
                            onChange={handleChange}
                            className={`px-4 py-2.5 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.quantidade ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.quantidade && (
                            <span className="text-xs text-red-600 mt-1">
                                {errors.quantidade}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-medium text-sm text-gray-700">
                            Status
                        </label>
                        <input
                            name="status"
                            onChange={handleChange}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-medium text-sm text-gray-700">
                            Lote
                        </label>
                        <input
                            name="lote"
                            onChange={handleChange}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-medium text-sm text-gray-700">
                            Validade Após Aberto
                        </label>
                        <input
                            type="date"
                            name="validadeAposAberto"
                            onChange={handleChange}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            className="px-6 py-2.5 rounded-lg font-medium text-sm text-white bg-red-600 border border-white hover:opacity-80"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={handleSubmit}
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
