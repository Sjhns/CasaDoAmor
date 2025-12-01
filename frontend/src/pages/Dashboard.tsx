import { Search, PackageOpen, User } from "lucide-react";
import { useState } from "react";
import axios from "axios";
// import MedicationFormModal from "../components/MedicationFormModal";
import { MedicamentosTable } from "../components/MedicamentoTable";
import { SearchBar } from "../components/SearchBar";
import { useDebounce } from "../hook/useDebounce";
import MedicationFormModal from "../components/MedicationFormModal";
import { type FormData } from "../schemas/MedicationFormModal.schema"; //
import ModalCadastroEstoque from "../components/ModalCadastroEstoque";
import { Layout } from "../components/layout";
import { API_URL } from "../constants";

export const Dashboard = () => {
    const [novoMedicamentoId, setNovoMedicamentoId] = useState<string | null>(
        null
    );

    // busca na tabela
    const [tabelaBusca, setTabelaBusca] = useState("");
    // delay usando debounce
    const debaunceBusca = useDebounce(tabelaBusca, 500); // 500 ms
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCadastrarEstoqueOpen, setIsCadastrarEstoqueOpen] = useState(false);
    const [editingMed, setEditingMed] = useState<
        (FormData & { id: string }) | undefined
    >(undefined);

    // const [tabelaBuscaQuery, setTabelaBuscaQuery] = useState("");

    const handleOpenCreateModal = () => {
        setEditingMed(undefined);
        setIsModalOpen(true);
    };

    const handleMedicationCreated = (id: string) => {
        setNovoMedicamentoId(id);
        setIsModalOpen(false); // Fecha o modal de medicamento
        setIsCadastrarEstoqueOpen(true); // Abre o modal de estoque
    };

    // Abre modal de edição buscando o medicamento por ID no backend
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
            console.error("Falha ao buscar medicamento por ID", e);
            alert("Não foi possível carregar o medicamento para edição.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseCadastrarEstoque = () => {
        setIsCadastrarEstoqueOpen(false);
    };

    const handleOpenCadastrarEstoque = () => {
        setIsCadastrarEstoqueOpen(true);
    };

    return (
        <Layout>
            {/* <div className="min-h-screen bg-gray-50"> */}

            <div className="flex flex-col md:flex-row">
                {/* Sidebar */}

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 p-2">
                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-16 mt-8 text-center">
                            Estoque geral de remédios
                        </h1>

                        {/* Search and Actions */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 mb-16">
                            <div className="w-full md:flex-1 md:max-w-2xl relative">
                                <SearchBar
                                    value={tabelaBusca}
                                    onChange={setTabelaBusca}
                                    placeholder="Buscar por nome, lote ou categoria..."
                                />
                            </div>

                            <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-end md:ml-auto flex-shrink-0">
                                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"></button>
                                <button
                                    onClick={() => handleOpenCadastrarEstoque()}
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

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <MedicamentosTable
                                searchTerm={debaunceBusca}
                                onEdit={handleOpenEditById}
                            />
                        </div>
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <MedicationFormModal
                    medicationData={editingMed}
                    onClose={handleCloseModal}
                    onSuccessCreate={handleMedicationCreated}
                />
            )}

            {isCadastrarEstoqueOpen && (
                <ModalCadastroEstoque
                    onClose={handleCloseCadastrarEstoque}
                    open={isCadastrarEstoqueOpen}
                    defaultMedicamentoId={novoMedicamentoId ?? undefined}
                />
            )}
            {/* </div> */}
        </Layout>
    );
};
