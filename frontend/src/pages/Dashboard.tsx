import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MedicamentosTable } from "../components/MedicamentoTable";
import { SearchBar } from "../components/SearchBar";
import { useDebounce } from "../hook/useDebounce";
import MedicationFormModal from "../components/MedicationFormModal";
import ModalCadastroEstoque from "../components/ModalCadastroEstoque";
import ModalDespacho from "../components/DespachoModal";
import MedicationDetailsModal from "../components/MedicationDetailModal"; // <--- NOVO IMPORT
import { Layout } from "../components/layout";
import { API_URL } from "../constants";
import { type FormData } from "../schemas/MedicationFormModal.schema";
import type { MedicamentoResponse } from "../services/fetch-medicamentos"; // Importando o tipo

export const Dashboard = () => {
    const location = useLocation();
    // Busca e Filtros
    const [tabelaBusca, setTabelaBusca] = useState("");
    const debaunceBusca = useDebounce(tabelaBusca, 500);

    // Estado para forçar atualização da tabela
    const [refreshKey, setRefreshKey] = useState(0);

    // Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCadastrarEstoqueOpen, setIsCadastrarEstoqueOpen] = useState(false);

    // Configurações do Modal de Despacho
    const [isDespachoOpen, setIsDespachoOpen] = useState(false);
    const [medicationToDispatch, setMedicationToDispatch] = useState<{
        id: string;
        nome: string;
        estoqueAtual: number;
    } | null>(null);

    // Configurações do Modal de Detalhes (NOVO)
    const [viewingMed, setViewingMed] = useState<MedicamentoResponse | null>(
        null
    );

    // Configurações do Modal de Edição/Criação
    const [novoMedicamentoId, setNovoMedicamentoId] = useState<string | null>(
        null
    );
    const [editingMed, setEditingMed] = useState<
        (FormData & { id: string }) | undefined
    >(undefined);

    // --- Handlers de Abertura ---

    const handleOpenCreateModal = () => {
        setEditingMed(undefined);
        setIsModalOpen(true);
    };

    const handleOpenCadastrarEstoque = () => {
        setIsCadastrarEstoqueOpen(true);
    };

    const handleOpenDispatch = (id: string) => {
        axios.get(`${API_URL}/medicamento/${id}`).then((res) => {
            setMedicationToDispatch({
                id: res.data.id,
                nome: res.data.nome,
                estoqueAtual: res.data.estoqueTotal || res.data.estoqueAtual,
            });
            setIsDespachoOpen(true);
        });
    };

    // NOVO HANDLER: Abre o modal de detalhes
    const handleOpenDetails = (med: MedicamentoResponse) => {
        setViewingMed(med);
    };

    // --- Handlers de Sucesso ---

    const handleRefreshTable = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleMedicationCreated = (id: string) => {
        setNovoMedicamentoId(id);
        setIsModalOpen(false);
        handleRefreshTable();
        setIsCadastrarEstoqueOpen(true);
    };

    const handleDispatchSuccess = () => {
        handleRefreshTable();
    };

    const handleOpenEditById = async (id: string) => {
        try {
            const { data } = await axios.get(`${API_URL}/medicamento/${id}`);
            const formData: FormData & { id: string } = {
                id: String(data.id),
                nome: data.nome ?? "",
                denominacaoGenericaId: data.denominacaoGenerica?.id ?? "",
                formaFarmaceutica: data.formaFarmaceutica ?? "",
                categoriaTerapeutica: data.categoriaTerapeutica ?? "",
                laboratorioFabricante: data.laboratorioFabricante ?? "",
                viaDeAdministracao: data.viaDeAdministracao ?? "",
                concentracao: data.concentracao ?? "",
                estoqueMinimo: String(data.estoqueMinimo ?? ""),
                estoqueMaximo: String(data.estoqueMaximo ?? ""),
            };
            setEditingMed(formData);
            setIsModalOpen(true);
        } catch (e) {
            console.error("Erro ao buscar para edição", e);
        }
    };

    // Se vier um estado de navegação com busca (ex.: ao clicar na notificação), aplica a busca
    useEffect(() => {
        const state = location.state as { search?: string } | null;
        if (state?.search) {
            setTabelaBusca(state.search);
        }
    }, [location.state]);

    return (
        <Layout>
            <div className="flex flex-col md:flex-row">
                <main className="flex-1 bg-gray-50 p-2">
                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-16 mt-8 text-center">
                            Estoque geral de remédios
                        </h1>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 mb-16">
                            <div className="w-full md:flex-1 md:max-w-2xl relative">
                                <SearchBar
                                    value={tabelaBusca}
                                    onChange={setTabelaBusca}
                                    placeholder="Buscar por nome, lote ou categoria..."
                                />
                            </div>

                            <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-end md:ml-auto shrink-0">
                                <button
                                    onClick={handleOpenCadastrarEstoque}
                                    className="bg-sky-500 text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-sky-600 transition-colors text-sm md:text-base whitespace-nowrap"
                                >
                                    Cadastrar estoque
                                </button>
                                <button
                                    className="bg-black text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
                                    onClick={handleOpenCreateModal}
                                >
                                    Adicionar remédio
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <MedicamentosTable
                                key={refreshKey}
                                searchTerm={debaunceBusca}
                                onEdit={handleOpenEditById}
                                onDispatch={handleOpenDispatch}
                                onViewDetails={handleOpenDetails} // <--- PASSANDO A PROP NOVA
                            />
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Criação/Edição */}
            {isModalOpen && (
                <MedicationFormModal
                    medicationData={editingMed}
                    onClose={() => setIsModalOpen(false)}
                    onSuccessCreate={handleMedicationCreated}
                />
            )}

            {/* Modal Cadastro de Estoque */}
            {isCadastrarEstoqueOpen && (
                <ModalCadastroEstoque
                    onClose={() => {
                        setIsCadastrarEstoqueOpen(false);
                        handleRefreshTable();
                    }}
                    open={isCadastrarEstoqueOpen}
                    defaultMedicamentoId={novoMedicamentoId ?? undefined}
                />
            )}

            {/* Modal Despacho */}
            {isDespachoOpen && (
                <ModalDespacho
                    open={isDespachoOpen}
                    onClose={() => setIsDespachoOpen(false)}
                    medication={medicationToDispatch}
                    onSuccess={handleDispatchSuccess}
                />
            )}

            {/* NOVO: Modal de Detalhes (Leitura) */}
            <MedicationDetailsModal
                isOpen={!!viewingMed}
                onClose={() => setViewingMed(null)}
                medicamento={viewingMed}
            />
        </Layout>
    );
};
