import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface ModalCadastroEstoqueProps {
    open: boolean;
    onClose: () => void;
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
}: ModalCadastroEstoqueProps) {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [form, setForm] = useState<FormEstoque>({
        medicamentoId: "",
        quantidade: "",
        status: "",
        lote: "",
        validadeAposAberto: "",
    });

    useEffect(() => {
        if (open) {
            fetch(
                "http://localhost:8080/medicamento?page=1&per_page=50&sort_by=nome&sort_dir=asc"
            )
                .then((res) => res.json())
                .then((data) => setMedicamentos(data.itens || []))
                .catch((err) => console.error(err));
        }
    }, [open]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const med = medicamentos.find(
            (m) => m.idMedicamento === form.medicamentoId
        );
        if (!med) return;

        // Validação de quantidade mínima e máxima
        if (form.quantidade === "") {
            alert("Informe a quantidade.");
            return;
        }

        if (form.quantidade < med.estoqueMinimo) {
            alert(
                `Quantidade abaixo do mínimo permitido: ${med.estoqueMinimo}`
            );
            return;
        }

        if (form.quantidade > med.estoqueMaximo) {
            alert(`Quantidade acima do máximo permitido: ${med.estoqueMaximo}`);
            return;
        }

        fetch("http://localhost:8080/estoque", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then(() => onClose())
            .catch((err) => console.error(err));
    };

    if (!open) return null;

    const medicamentoSelecionado = medicamentos.find(
        (m) => m.idMedicamento === form.medicamentoId
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-xl animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4">
                    Cadastrar Estoque
                </h2>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">
                            Medicamento
                        </label>
                        <select
                            name="medicamentoId"
                            value={form.medicamentoId}
                            onChange={handleChange}
                            className="border rounded p-2 focus:ring focus:ring-blue-300"
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

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">
                            Quantidade
                        </label>
                        <input
                            type="number"
                            name="quantidade"
                            onChange={handleChange}
                            className="border rounded p-2 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Status</label>
                        <input
                            name="status"
                            onChange={handleChange}
                            className="border rounded p-2 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Lote</label>
                        <input
                            name="lote"
                            onChange={handleChange}
                            className="border rounded p-2 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">
                            Validade Após Aberto
                        </label>
                        <input
                            type="date"
                            name="validadeAposAberto"
                            onChange={handleChange}
                            className="border rounded p-2 focus:ring focus:ring-blue-300"
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
