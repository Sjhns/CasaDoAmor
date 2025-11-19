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
        <div className="min-h-screen">
            <header className="bg-sky-500 px-10 py-2 flex items-center justify-between">
                <div className="flex-1 max-w-xl  mx-auto">
                    <div className="relative ">
                        <input
                            type="text"
                            placeholder="Pesquise algo"
                            value={buscaQuery}
                            onChange={(e) => setBuscaQuery(e.target.value)}
                            className="w-full bg-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 placeholder-gray-500 focus:outline-none "
                        />

                        <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center  rounded-r-lg transition-colors cursor-pointer">
                            <Search className="text-gray-500 w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-white font-medium text-sm">
                            Casa do Amor
                        </p>
                        <p className="text-sky-100 text-xs">Administrador</p>
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center border-white rounded-full bg-white hover:bg-sky-50 transition-colors cursor-pointer">
                        <img
                            src="https://api.dicebear.com/9.x/adventurer/svg?seed=CasaDoAmor"
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="flex bg-gray-50 h-screen">
                {/* Barra lateral */}
                <aside className="min-w-52 p-6 flex flex-col border-r border-gray-300 shadow-md min-h-screen h-full">
                    {/* <div className="mb-12 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-red-500 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                  <div className="w-full h-0.5 bg-red-500 absolute top-1/2 transform -translate-y-1/2 rotate-45"></div>
                  <div className="w-full h-0.5 bg-red-500 absolute top-1/2 transform -translate-y-1/2 -rotate-45"></div>
                </div>
              </div>
            </div>
          </div> */}

                    <nav className="flex-1 space-y-4">
                        <button className="w-full rounded-lg px-4 py-3 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-lg">
                            <PackageOpen className="w-5 h-5 inline-block mr-2" />
                            Estoque
                        </button>
                        <button className="w-full rounded-lg px-4 py-3 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-lg">
                            <User className="w-5 h-5 inline-block mr-2" />
                            Perfil
                        </button>
                    </nav>
                </aside>

                {/* Área de Conteúdo */}
                <main className="bg-gray-50 p-3 w-[calc(100%-208px)]">
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        {/* <div> */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">
                            Estoque geral de remédios
                        </h1>

                        {/* Busca e Ações */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 max-w-2xl relative">
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
                            <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <Filter className="w-6 h-6 text-gray-700" />
                            </button>
                            <button className="bg-sky-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-600 transition-colors">
                                Cadastrar categoria
                            </button>
                            <button
                                className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                                onClick={handleOpenCreateModal}
                            >
                                Adicionar remédio
                            </button>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto">
                            <MedicamentosTable />
                            {/* <table className="w-full rounded-2xl overflow-hidden">

                
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      NOME
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Lote
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Vencimento
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Propósito
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {remediosFiltrados.map((remedio, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 transition-colors ${
                        remedio.status === "vencido"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium">
                        {remedio.id.slice(0, 6)}...
                      </td>
                      <td className="px-6 py-4">{remedio.nome}</td>
                      <td className="px-6 py-4">{remedio.lote}</td>
                      <td className="px-6 py-4">{remedio.tipo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-5">
                          {remedio.vencimento}
                          {remedio.status === "atencao" && (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          )}
                          {remedio.status === "vencido" && (
                            <X className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{remedio.proposito}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            className={`p-1.5 hover:bg-opacity-10 rounded transition-colors ${
                              remedio.status === "vencido"
                                ? "hover:bg-white"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <ArrowRight
                              className={`w-5 h-5 ${
                                remedio.status === "vencido"
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                          <button
                            className={`p-1.5 hover:bg-opacity-10 rounded transition-colors ${
                              remedio.status === "vencido"
                                ? "hover:bg-white"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <Pencil
                              className={`w-5 h-5 ${
                                remedio.status === "vencido"
                                  ? "text-white"
                                  : "text-green-500"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
                        </div>

                        <div className="mt-8">
                            {!error &&
                                tabelaBuscaQuery &&
                                remediosFiltrados.length === 0 && (
                                    <span className="text-gray-700 text-lg text-center block">
                                        Nenhum remédio encontrado para "
                                        {tabelaBuscaQuery}"
                                    </span>
                                )}
                        </div>

                        <div className="mt-8">
                            {!error &&
                                !tabelaBuscaQuery &&
                                remediosFiltrados.length === 0 && (
                                    <span className="text-gray-700 text-lg text-center block">
                                        Nenhum remédio cadastrado no momento.
                                    </span>
                                )}
                        </div>

                        {error && (
                            <div className="mt-8 p-4 bg-red-100 border border-red-400 rounded-lg flex flex-col justify-center items-center">
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
                            <div className="mt-8 text-gray-600 text-center">
                                Total de remédios: {remediosFiltrados.length}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* </div> */}

            {isModalOpen && (
                <MedicationFormModal
                    medicationData={editingMed}
                    onClose={handleCloseModal}
                />
            )}

            {/* crie rodape */}
        </div>
    );
};
