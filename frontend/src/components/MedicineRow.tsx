import { Pencil, AlertTriangle, X, CheckCircle } from "lucide-react";
import {
    Typography,
    IconButton,
    Tooltip,
    Chip,
} from "@material-tailwind/react";
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

    let statusColor: "green" | "amber" | "red" = "green";
    let StatusIcon = CheckCircle;

    if (status === "atencao") {
        statusColor = "amber";
        StatusIcon = AlertTriangle;
    } else if (status === "vencido") {
        statusColor = "red";
        StatusIcon = X;
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className={classes}>
                <div className="flex flex-col">
                    {/* @ts-expect-error Material Tailwind types are too strict */}
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                    >
                        #{medicamento.id.substring(0, 6)}
                    </Typography>
                </div>
            </td>

            <td className={classes}>
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold"
                >
                    {medicamento.nome}
                </Typography>
            </td>

            <td className={classes}>
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {medicamento.lote}
                </Typography>
            </td>

            <td className={classes}>
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {medicamento.formaFarmaceutica}
                </Typography>
            </td>

            <td className={classes}>
                <div className="w-max">
                    <Chip
                        variant="ghost"
                        size="sm"
                        value={dataValidade}
                        color={statusColor}
                        icon={<StatusIcon className="mt-0.5 h-4 w-4" />}
                    />
                </div>
            </td>

            {}
            <td className={classes}>
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {medicamento.categoriaTerapeutica}
                </Typography>
            </td>

            {/* Coluna 7: Ações */}
            <td className={classes}>
                <div className="flex items-center gap-2">
                    <Tooltip content="Editar Medicamento">
                        {/* @ts-expect-error Material Tailwind types are too strict */}
                        <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => onEdit(medicamento.id)}
                        >
                            <Pencil className="h-4 w-4" />
                        </IconButton>
                    </Tooltip>
                </div>
            </td>
        </tr>
    );
};
