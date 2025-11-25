import {
    Pencil,
    AlertTriangle,
    X,
    CheckCircle,
    ArrowRight,
} from "lucide-react";
// Replaced Material Tailwind components with Tailwind markup
import { getStatusByDate } from "../utils";

interface MedicineRowProps {
    medicamento: {
        id: string;
        nome: string;
        lote: string;
        formaFarmaceutica: string;
        categoriaTerapeutica: string;
        validade: string;
    };
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
    const status = getStatusByDate(medicamento.validade);
    const dataValidade = new Date(medicamento.validade).toLocaleDateString(
        "pt-BR"
    );

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
                        #{medicamento.id.substring(0, 6)}
                    </span>
                </div>
            </td>

            <td className={tdClass()}>
                <span
                    className={`text-sm font-bold ${expired ? "text-red-800" : "text-gray-900"}`}
                >
                    {medicamento.nome}
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
                        {dataValidade}
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
                        onClick={() => onDispatch && onDispatch(medicamento.id)}
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
                        onClick={() => onEdit(medicamento.id)}
                        className={`p-2 rounded hover:bg-gray-100 ${expired ? "text-red-700" : "text-gray-700"}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};
