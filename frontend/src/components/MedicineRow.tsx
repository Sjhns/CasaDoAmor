import {
    Pencil,
    AlertTriangle,
    X,
    CheckCircle,
    ArrowRight,
} from "lucide-react";
import { getStatusByDate } from "../utils";
import type { MedicamentoResponse } from "../services/fetch-medicamentos";

interface MedicineRowProps {
    medicamento: MedicamentoResponse;
    onEdit: (id: string) => void;
    onDispatch?: (id: string) => void;
    isLast: boolean;
}

export const MedicineRow = ({
    medicamento,
    onEdit,
    onDispatch,
    isLast,
}: MedicineRowProps & { lastRowClass?: string }) => {
    const status = getStatusByDate("");

    const tdClass = (extra: string = "") =>
        isLast
            ? `p-2 text-xs sm:p-4 sm:text-sm ${extra} min-w-[90px]`
            : `p-2 text-xs sm:p-4 sm:text-sm border-b border-blue-gray-50 ${extra} min-w-[90px]`;
    const expired = status === "vencido";

    let StatusIcon = CheckCircle;

    if (status === "atencao") {
        StatusIcon = AlertTriangle;
    } else if (status === "vencido") {
        StatusIcon = X;
    }

    return (
        <tr
            className={`${expired ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"} transition-colors`}
        >
            <td className={tdClass()}>
                <div className="flex flex-col">
                    <span
                        className={`text-sm font-normal opacity-70 ${expired ? "text-red-700" : "text-gray-600"}`}
                    >
                        #{medicamento.idMedicamento.substring(0, 6)}
                    </span>
                </div>
            </td>

            <td className={tdClass()}>
                <span
                    className={`text-sm font-bold ${expired ? "text-red-800" : "text-gray-900"}`}
                >
                    {medicamento.nomeMedicamento}
                </span>
            </td>

            <td className={tdClass()}>
                <span
                    className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}
                >
                    {medicamento.lote}
                </span>
            </td>

            <td className={tdClass()}>
                <span
                    className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}
                >
                    {medicamento.formaFarmaceutica}
                </span>
            </td>

            <td className={tdClass()}>
                <div className="w-max">
                    <span
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded text-sm ${
                            status === "vencido"
                                ? "bg-red-600 text-white"
                                : status === "atencao"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-green-50 text-green-700"
                        }`}
                    >
                        <StatusIcon className="mt-0.5 h-4 w-4" />
                        {new Date(
                            medicamento.validade || ""
                        ).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            timeZone: "UTC",
                        })}
                    </span>
                </div>
            </td>

            <td className={tdClass()}>
                <span
                    className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}
                >
                    {medicamento.categoriaTerapeutica}
                </span>
            </td>

            {/* Coluna Despacho */}
            <td className={tdClass()}>
                <div className="flex items-center justify-center">
                    <button
                        title="Despachar (saída de estoque)"
                        onClick={() =>
                            onDispatch && onDispatch(medicamento.idMedicamento)
                        }
                        className={`p-2 rounded hover:bg-gray-100 ${expired ? "text-red-700" : "text-gray-700"}`}
                    >
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </td>

            {/* Coluna Edição */}
            <td className={tdClass()}>
                <div className="flex items-center justify-center">
                    <button
                        title="Editar Medicamento"
                        onClick={() => onEdit(medicamento.idMedicamento)}
                        className={`p-2 rounded hover:bg-gray-100 ${expired ? "text-red-700" : "text-gray-700"}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};
