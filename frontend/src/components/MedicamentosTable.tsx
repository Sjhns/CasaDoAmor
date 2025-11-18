import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    AlertCircle,
} from "lucide-react";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
} from "@material-tailwind/react";
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
    { label: "Ações", sortable: false },
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
    itemsPerPage = 6,
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

    const handleEdit = (id: string) => {
        if (onEdit) {
            onEdit(id);
        } else {
            console.log("Editar medicamento:", id);
        }
    };

    // Renderização de Loading com Skeleton
    if (isLoading) {
        return (
            // @ts-expect-error Material Tailwind types are too strict
            <Card className="h-full w-full shadow-sm border border-gray-200 rounded-lg">
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none mb-0 pb-2"
                >
                    {/* @ts-expect-error Material Tailwind types are too strict */}
                    <Typography variant="h5" color="blue-gray">
                        Lista de Medicamentos
                    </Typography>
                </CardHeader>
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <CardBody className="overflow-scroll px-0 pt-0">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head.label}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                    >
                                        {/* @ts-expect-error Material Tailwind types are too strict */}
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal opacity-70"
                                        >
                                            {head.label}
                                        </Typography>
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
                </CardBody>
            </Card>
        );
    }

    // Renderização de Erro
    if (isError) {
        return (
            // @ts-expect-error Material Tailwind types are too strict
            <Card className="h-full w-full shadow-sm border border-red-200 rounded-lg bg-red-50">
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <CardBody className="flex items-center justify-center gap-3 py-12">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <div>
                        {/* @ts-expect-error Material Tailwind types are too strict */}
                        <Typography variant="h6" color="red">
                            Erro ao carregar medicamentos
                        </Typography>
                        {/* @ts-expect-error Material Tailwind types are too strict */}
                        <Typography color="gray" className="text-sm">
                            Tente recarregar a página ou contate o suporte.
                        </Typography>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        // @ts-expect-error Material Tailwind types are too strict
        <Card className="h-full w-full shadow-sm border border-gray-200 rounded-lg">
            {/* @ts-expect-error Material Tailwind types are too strict */}
            <CardHeader
                floated={false}
                shadow={false}
                className="rounded-none mb-0 pb-2"
            >
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        {/* @ts-expect-error Material Tailwind types are too strict */}
                        <Typography variant="h5" color="blue-gray">
                            Lista de Medicamentos
                        </Typography>
                        {/* @ts-expect-error Material Tailwind types are too strict */}
                        <Typography color="gray" className="mt-1 font-normal">
                            {totalItems > 0
                                ? `Visualizando ${itemStart}-${itemEnd} de ${totalItems} medicamentos`
                                : "Nenhum medicamento encontrado"}
                        </Typography>
                    </div>
                </div>
            </CardHeader>

            {/* @ts-expect-error Material Tailwind types are too strict */}
            <CardBody className="overflow-x-auto px-0 pt-0">
                <table className="w-full min-w-max table-auto text-left">
                    {/* 3. Thead com colunas */}
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head.label}
                                    className={`cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors ${
                                        head.sortable
                                            ? "hover:bg-blue-gray-100"
                                            : ""
                                    }`}
                                    onClick={
                                        head.sortable ? toggleSort : undefined
                                    }
                                >
                                    {/* @ts-expect-error Material Tailwind types are too strict */}
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-semibold leading-none opacity-70"
                                    >
                                        {head.label}
                                        {head.sortable && (
                                            <ArrowUpDown className="h-4 w-4" />
                                        )}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* 4. Tbody com MedicineRow */}
                    <tbody>
                        {medicamentos.length > 0 ? (
                            medicamentos.map(
                                (
                                    med: (typeof medicamentos)[0],
                                    index: number
                                ) => (
                                    <MedicineRow
                                        key={med.id}
                                        medicamento={med}
                                        onEdit={handleEdit}
                                        isLast={
                                            index === medicamentos.length - 1
                                        }
                                    />
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={TABLE_HEAD.length}
                                    className="p-8 text-center"
                                >
                                    {/* @ts-expect-error Material Tailwind types are too strict */}
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                    >
                                        Nenhum medicamento encontrado.
                                    </Typography>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardBody>

            {/* Paginação no Footer */}
            {/* @ts-expect-error Material Tailwind types are too strict */}
            <CardFooter className="flex flex-col gap-4 items-center justify-between border-t border-blue-gray-50 p-4 md:flex-row">
                {/* @ts-expect-error Material Tailwind types are too strict */}
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    Página {page} de {totalPages}
                </Typography>
                <div className="flex gap-2">
                    {/* @ts-expect-error Material Tailwind types are too strict */}
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </Button>
                    {/* @ts-expect-error Material Tailwind types are too strict */}
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() =>
                            setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="flex items-center gap-1"
                    >
                        Próxima <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
