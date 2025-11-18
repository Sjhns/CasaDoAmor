import { Pencil, AlertTriangle, X, CheckCircle } from "lucide-react";
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
    isLast: boolean;
}

export const MedicineRow = ({
    medicamento,
    onEdit,
    isLast,
}: MedicineRowProps) => {
    const status = getStatusByDate(medicamento.validade);
    const dataValidade = new Date(medicamento.validade).toLocaleDateString(
        "pt-BR"
    );

    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
    const expired = status === "vencido";

    let StatusIcon = CheckCircle;

    if (status === "atencao") {
        StatusIcon = AlertTriangle;
    } else if (status === "vencido") {
        StatusIcon = X;
    }

    return (
        <tr
            className={`${expired ? "bg-red-50" : "hover:bg-gray-50"} transition-colors`}
        >
            <td className={classes}>
                <div className="flex flex-col">
                    <span
                        className={`text-sm font-normal opacity-70 ${expired ? "text-red-700" : "text-gray-600"}`}
                    >
                        #{medicamento.id.substring(0, 6)}
                    </span>
                </div>
            </td>

            <td className={classes}>
                <span
                    className={`text-sm font-bold ${expired ? "text-red-800" : "text-gray-900"}`}
                >
                    {medicamento.nome}
                </span>
            </td>

            <td className={classes}>
                <span
                    className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}
                >
                    {medicamento.lote}
                </span>
            </td>

            <td className={classes}>
                <span
                    className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}
                >
                    {medicamento.formaFarmaceutica}
                </span>
            </td>

            <td className={classes}>
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

            <td className={classes}>
                <span
                    className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}
                >
                    {medicamento.categoriaTerapeutica}
                </span>
            </td>

            {/* Coluna 7: Ações */}
            <td className={classes}>
                <div className="flex items-center gap-2">
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
