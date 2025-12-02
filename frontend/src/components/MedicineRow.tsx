import { useState } from "react";
import {
    Pencil,
    AlertTriangle,
    X,
    CheckCircle,
    ArrowRight,
    ChevronDown,
    ChevronRight,
    Package
} from "lucide-react";
import { getStatusByDate } from "../utils";
import type { MedicamentoResponse } from "../services/fetch-medicamentos";

interface MedicineRowProps {
    medicamento: MedicamentoResponse;
    onEdit: (id: string) => void;
    onDispatch?: (id: string) => void;
    
    // --- ADICIONE ISTO PARA CORRIGIR O ERRO ---
    onViewDetails?: (med: MedicamentoResponse) => void; 
    // -----------------------------------------

    isLast: boolean;
    lastRowClass?: string;
}

export const MedicineRow = ({
    medicamento,
    onEdit,
    onDispatch,
    onViewDetails, // <--- Recebendo aqui
    isLast,
}: MedicineRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const rawDate = medicamento.validade;
    const isValidDate = rawDate && !isNaN(new Date(rawDate).getTime());
    const hasStock = (medicamento.quantidadeTotalEstoque || 0) > 0;
    const status = (hasStock && isValidDate) ? getStatusByDate(rawDate) : "indisponivel";

    const lotesCount = medicamento.estoques?.length || 0;
    const hasMultipleBatches = lotesCount > 1;

    const tdClass = (extra: string = "") => {
        const baseClasses = `p-2 text-xs sm:p-4 sm:text-sm ${extra} min-w-[90px] align-middle`;
        return isLast 
            ? baseClasses 
            : `${baseClasses} border-b border-blue-gray-50`;
    };

    const expired = status === "vencido";

    let StatusIcon = CheckCircle;
    let statusColorClass = "bg-green-50 text-green-700";

    if (status === "atencao") {
        StatusIcon = AlertTriangle;
        statusColorClass = "bg-amber-50 text-amber-700";
    } else if (status === "vencido") {
        StatusIcon = X;
        statusColorClass = "bg-red-600 text-white";
    } else if (!hasStock) {
        StatusIcon = Package;
        statusColorClass = "bg-gray-100 text-gray-500";
    }

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
        });
    };

    const handleRowClick = () => {
        if (hasMultipleBatches) {
            setIsExpanded(!isExpanded);
        } else {
            // Se tiver a função e for lote único, abre detalhes
            if (onViewDetails) {
                onViewDetails(medicamento);
            }
        }
    };

    return (
        <>
            <tr
                className={`transition-colors cursor-pointer ${
                    isExpanded ? "bg-blue-50/50" : expired ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                }`}
                onClick={handleRowClick}
            >
                {/* ID e Chevron */}
                <td className={tdClass()}>
                    <div className="flex items-center gap-2">
                        {hasMultipleBatches && (
                            <button 
                                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick();
                                }}
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}
                        {!hasMultipleBatches && <div className="w-6" />} 
                        
                        <span className={`text-sm font-normal opacity-70 ${expired ? "text-red-700" : "text-gray-600"}`}>
                            #{medicamento.idMedicamento.substring(0, 6)}
                        </span>
                    </div>
                </td>

                <td className={tdClass()}>
                    <div className="flex flex-col items-start gap-1">
                        <span className={`text-sm font-bold ${expired ? "text-red-800" : "text-gray-900"}`}>
                            {medicamento.nomeMedicamento}
                        </span>
                        
                        {hasMultipleBatches && (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                {lotesCount} lotes
                            </span>
                        )}
                    </div>
                </td>

                <td className={tdClass("text-center")}>
                    <span className={`text-sm font-semibold ${expired ? "text-red-800" : "text-gray-900"}`}>
                        {medicamento.quantidadeTotalEstoque ?? 0}
                    </span>
                </td>

                <td className={tdClass()}>
                    <span className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}>
                        {hasMultipleBatches 
                            ? "Múltiplos..." 
                            : medicamento.lote || "-"}
                    </span>
                </td>

                <td className={tdClass()}>
                    <span className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}>
                        {medicamento.formaFarmaceutica}
                    </span>
                </td>

                <td className={tdClass()}>
                    <div className="w-max">
                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-sm ${statusColorClass}`}>
                            <StatusIcon className="mt-0.5 h-4 w-4" />
                            {hasStock && isValidDate ? formatDate(rawDate) : "Esgotado"}
                        </span>
                    </div>
                </td>

                <td className={tdClass()}>
                    <span className={`text-sm font-normal ${expired ? "text-red-700" : "text-gray-600"}`}>
                        {medicamento.categoriaTerapeutica}
                    </span>
                </td>

                <td className={tdClass()}>
                    <div className="flex items-center justify-center gap-1">
                        <button
                            title="Despachar (saída)"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onDispatch) onDispatch(medicamento.idMedicamento);
                            }}
                            className="p-2 rounded hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </td>

                <td className={tdClass()}>
                    <div className="flex items-center justify-center">
                        <button
                            title="Editar"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(medicamento.idMedicamento);
                            }}
                            className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* ACCORDION */}
            {hasMultipleBatches && isExpanded && (
                <tr className="bg-gray-50/80 animate-fadeIn">
                    <td colSpan={9} className="p-4 border-b border-gray-200 shadow-inner">
                        <div className="ml-8 pl-4 border-l-2 border-blue-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
                                Detalhamento de Estoque por Lote
                            </h4>
                            
                            <table className="w-full max-w-2xl text-sm text-left">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-200">
                                        <th className="pb-2 font-medium">Lote</th>
                                        <th className="pb-2 font-medium">Validade</th>
                                        <th className="pb-2 font-medium">Quantidade</th>
                                        <th className="pb-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {medicamento.estoques?.map((est, idx) => {
                                        const dataValidade = est.validadeAposAberto || ""; 
                                        const statusLote = dataValidade ? getStatusByDate(dataValidade) : "ok";
                                        
                                        return (
                                            <tr 
                                                key={est.id || idx} 
                                                className="hover:bg-blue-100 cursor-pointer transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Clicar no lote também abre os detalhes
                                                    if (onViewDetails) onViewDetails(medicamento);
                                                }}
                                            >
                                                <td className="py-2 font-medium text-gray-800">{est.lote}</td>
                                                <td className="py-2 text-gray-600">{formatDate(dataValidade)}</td>
                                                <td className="py-2 font-bold text-gray-800">{est.quantidade} un</td>
                                                <td className="py-2">
                                                    {statusLote === "vencido" && <span className="text-xs text-red-600 font-bold">Vencido</span>}
                                                    {statusLote === "atencao" && <span className="text-xs text-amber-600 font-bold">Vence em breve</span>}
                                                    {statusLote === "ok" && <span className="text-xs text-green-600">OK</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};