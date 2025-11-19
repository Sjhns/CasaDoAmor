import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    AlertCircle,
} from "lucide-react";
// Using plain Tailwind instead of @material-tailwind/react
import { useMedicamentos } from "../hook/useMedicamentos.mock";
import { MedicineRow } from "./MedicineRow";

interface MedicamentosTableProps {
    searchTerm?: string;
    itemsPerPage?: number;
    onEdit?: (id: string) => void;
}

const TABLE_HEAD = [
    { label: "ID", sortable: false },
    { label: "Nome", sortable: true, key: "nome" },
    { label: "Lote", sortable: false },
    { label: "Tipo", sortable: false },
    { label: "Vencimento", sortable: false },
    { label: "Propósito", sortable: false },
    { label: "Despacho", sortable: false, align: "center" },
    { label: "Edição", sortable: false, align: "center" },
];

// Componente de Skeleton para Loading
const SkeletonRow = () => (
    <tr>
        {TABLE_HEAD.map((_, idx) => (
            <td key={idx} className="p-4 border-b border-blue-gray-50">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
        ))}
    </tr>
);

export const MedicamentosTable = ({
    searchTerm = "",
    itemsPerPage = 5,
    onEdit,
}: MedicamentosTableProps) => {
    // 1. Estado e Hook (Integração)
    const [page, setPage] = useState(1);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const { data, isLoading, isError } = useMedicamentos({
        page: page,
        per_page: itemsPerPage,
        search: searchTerm,
        sort_by: "nome",
        sort_dir: sortDir,
    });

    const medicamentos = data?.content || [];
    const totalPages = data?.totalPages || 1;
    const totalItems = data?.totalElements || 0;
    const itemStart = (page - 1) * itemsPerPage + 1;
    const itemEnd = Math.min(page * itemsPerPage, totalItems);

    const toggleSort = () => {
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleDispatch = (id: string) => {
        // placeholder: abrir modal de saída / despacho ou navegar
        console.log("Despachar medicamento:", id);
        // TODO: integrar com fluxo real de movimentação de estoque
    };

    const handleEdit = (id: string) => {
        if (onEdit) {
            onEdit(id);
        } else {
            console.log("Editar medicamento:", id);
        }
    };

    // Renderização de Loading com Skeleton (Tailwind)
    if (isLoading) {
        return (
            <div className="h-full w-full shadow-sm  rounded-lg bg-white">
                <div className="rounded-none mb-0 pb-2 px-4 py-3">
                    <h5 className="text-lg font-semibold text-gray-900">
                        Lista de Medicamentos
                    </h5>
                </div>
                <div className="overflow-scroll px-0 pt-0">
                    <table className="w-full min-w-max table-auto text-left border-collapse">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head.label}
                                        className="border-b border-gray-100 bg-gray-100 p-4 first:rounded-tl-lg last:rounded-tr-lg"
                                    >
                                        <span className="text-sm text-gray-600 font-normal opacity-70">
                                            {head.label}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(itemsPerPage)].map((_, idx) => (
                                <SkeletonRow key={idx} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Renderização de Erro (Tailwind)
    if (isError) {
        return (
            <div className="h-full w-full shadow-sm border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center justify-center gap-3 py-12 px-4">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <div>
                        <h6 className="text-lg font-semibold text-red-600">
                            Erro ao carregar medicamentos
                        </h6>
                        <p className="text-sm text-gray-600">
                            Tente recarregar a página ou contate o suporte.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-lg bg-white overflow-hidden">
            <div className="rounded-none mb-0 pb-2 px-4 py-3">
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900">
                            Lista de Medicamentos
                        </h5>
                        <p className="mt-1 text-sm text-gray-500">
                            {totalItems > 0
                                ? `Visualizando ${itemStart}-${itemEnd} de ${totalItems} medicamentos`
                                : "Nenhum medicamento encontrado"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto px-0 pt-0 rounded-2xl">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head.label}
                                    className={`cursor-pointer border-b border-gray-100 bg-gray-100 p-4 transition-colors first:rounded-tl-lg last:rounded-tr-lg ${
                                        head.sortable ? "hover:bg-gray-100" : ""
                                    }`}
                                    onClick={
                                        head.sortable ? toggleSort : undefined
                                    }
                                >
                                    <span
                                        className={`flex items-center ${head.align === "center" ? "justify-center" : "justify-between"} gap-2 font-semibold leading-none text-sm text-gray-600 opacity-70`}
                                    >
                                        {head.label}
                                        {head.sortable && (
                                            <ArrowUpDown className="h-4 w-4" />
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {medicamentos.length > 0 ? (
                            medicamentos.map(
                                (
                                    med: (typeof medicamentos)[0],
                                    index: number
                                ) => (
                                    <MedicineRow
                                        key={`${med.id}-${index}`}
                                        medicamento={med}
                                        onEdit={handleEdit}
                                        onDispatch={handleDispatch}
                                        isLast={
                                            index === medicamentos.length - 1
                                        }
                                        lastRowClass="last:rounded-bl-lg last:rounded-br-lg"
                                    />
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={TABLE_HEAD.length}
                                    className="p-8 text-center"
                                >
                                    <span className="text-sm text-gray-600">
                                        Nenhum medicamento encontrado.
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginação no Footer */}
            <div className="flex flex-col gap-4 items-center justify-between p-4 md:flex-row">
                <span className="text-sm text-gray-600 font-normal">
                    Página {page} de {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 px-3 py-1.5 border rounded text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </button>
                    <button
                        onClick={() =>
                            setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 border rounded text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Próxima <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
