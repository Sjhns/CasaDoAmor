import {
    Search,
    Filter,
    ArrowRight,
    Pencil,
    AlertTriangle,
    X,
    PackageOpen,
    User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRemedios } from "../services/fetch-remedios";
import { getStatusByDate } from "../utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type FormData } from "../schemas/MedicationFormModal.schema";
import MedicationFormModal from "../components/MedicationFormModal";
import { MedicamentosTable } from "../components/MedicamentoTable";

interface Remedio {
    id: string;
    nome: string;
    lote: string;
    tipo: string;
    vencimento: string;
    proposito: string;
    status: "normal" | "atencao" | "vencido";
}

type MedicamentoComId = FormData & { id: number | string };

const fetchMedicamentos = async () => {
    const { data } = await axios.get("http://localhost:8080/medicamento");
    return data;
};

export const Dashboard = () => {
    const [buscaQuery, setBuscaQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMed, setEditingMed] = useState<MedicamentoComId | undefined>(
        undefined
    );

    const {
        data: medicamentos,
        isLoading,
        isError,
    } = useQuery<MedicamentoComId[]>({
        queryKey: ["medicamentos"],
        queryFn: fetchMedicamentos,
    });

    const [tabelaBuscaQuery, setTabelaBuscaQuery] = useState("");
    const [remedios, setRemedios] = useState<Remedio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Service para buscar remédios
    const getRemedios = async () => {
        try {
            setLoading(true);

            const data = await fetchRemedios();

            const remediosMapeados: Remedio[] = data.map((item) => ({
                id: item.id,
                nome: item.nome,
                lote: item.lote,
                tipo: item.formaFarmaceutica,
                vencimento: new Date(
                    new Date(item.validade).getTime() + 24 * 60 * 60 * 1000
                ).toLocaleDateString("pt-BR"),
                proposito: item.categoriaTerapeutica,
                status: getStatusByDate(item.validade),
            }));

            setRemedios(remediosMapeados);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    // Filtrar remédios baseado na busca
    const remediosFiltrados = remedios.filter(
        (remedio) =>
            remedio.nome.toLowerCase().includes(tabelaBuscaQuery.toLowerCase())
        // remedio.lote.toLowerCase().includes(tabelaBuscaQuery.toLowerCase())
    );

    const handleOpenCreateModal = () => {
        setEditingMed(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (medicamento: MedicamentoComId) => {
        setEditingMed(medicamento);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Buscar remédios ao montar o componente
    useEffect(() => {
        getRemedios();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-gray-700 text-lg">
                    Carregando remédios...
                </span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-sky-500 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                <div className="w-full md:flex-1 md:max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Pesquise algo"
                            value={buscaQuery}
                            onChange={(e) => setBuscaQuery(e.target.value)}
                            className="w-full bg-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 placeholder-gray-500 focus:outline-none"
                        />
                        <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center rounded-r-lg transition-colors cursor-pointer">
                            <Search className="text-gray-500 w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right hidden md:block">
                        <p className="text-white font-medium text-sm">
                            Casa do Amor
                        </p>
                        <p className="text-sky-100 text-xs">Administrador</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center border-white rounded-full bg-white hover:bg-sky-50 transition-colors cursor-pointer">
                        <img
                            src="https://api.dicebear.com/9.x/adventurer/svg?seed=CasaDoAmor"
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row h-full">
                {/* Sidebar */}
                <aside className="w-full md:min-w-52 md:w-52 p-4 md:p-6 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-gray-300 shadow-md min-h-[60px] md:min-h-screen h-full bg-white z-10">
                    <nav className="flex-1 flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-4">
                        <button className="w-full rounded-lg px-4 py-3 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base md:text-lg flex items-center">
                            <PackageOpen className="w-5 h-5 inline-block mr-2" />
                            <span className="hidden sm:inline">Estoque</span>
                        </button>
                        <button className="w-full rounded-lg px-4 py-3 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base md:text-lg flex items-center">
                            <User className="w-5 h-5 inline-block mr-2" />
                            <span className="hidden sm:inline">Perfil</span>
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 p-2 md:p-6 w-full">
                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center md:text-left">
                            Estoque geral de remédios
                        </h1>

                        {/* Search and Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4 md:mb-6">
                            <div className="w-full md:flex-1 md:max-w-2xl relative">
                                <input
                                    type="text"
                                    placeholder="Buscar remédio..."
                                    value={tabelaBuscaQuery}
                                    onChange={(e) =>
                                        setTabelaBuscaQuery(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                            <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
                                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Filter className="w-6 h-6 text-gray-700" />
                                </button>
                                <button className="bg-sky-500 text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-sky-600 transition-colors text-sm md:text-base">
                                    Cadastrar categoria
                                </button>
                                <button
                                    className="bg-black text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm md:text-base"
                                    onClick={handleOpenCreateModal}
                                >
                                    Adicionar remédio
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <MedicamentosTable />
                        </div>

                        <div className="mt-6 md:mt-8">
                            {!error &&
                                tabelaBuscaQuery &&
                                remediosFiltrados.length === 0 && (
                                    <span className="text-gray-700 text-lg text-center block">
                                        Nenhum remédio encontrado para "
                                        {tabelaBuscaQuery}"
                                    </span>
                                )}
                        </div>

                        <div className="mt-6 md:mt-8">
                            {!error &&
                                !tabelaBuscaQuery &&
                                remediosFiltrados.length === 0 && (
                                    <span className="text-gray-700 text-lg text-center block">
                                        Nenhum remédio cadastrado no momento.
                                    </span>
                                )}
                        </div>

                        {error && (
                            <div className="mt-6 md:mt-8 p-4 bg-red-100 border border-red-400 rounded-lg flex flex-col justify-center items-center">
                                <span>
                                    <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                                </span>
                                <p className="flex items-center gap-2 text-lg font-semibold">
                                    Tivemos um problema ao carregar os remédios
                                </p>
                                <div className="mt-4 font-medium">{error}</div>
                            </div>
                        )}

                        {remediosFiltrados.length > 0 && (
                            <div className="mt-6 md:mt-8 text-gray-600 text-center">
                                Total de remédios: {remediosFiltrados.length}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <MedicationFormModal
                    medicationData={editingMed}
                    onClose={handleCloseModal}
                />
            )}
            {/* Rodapé opcional */}
        </div>
    );
};
