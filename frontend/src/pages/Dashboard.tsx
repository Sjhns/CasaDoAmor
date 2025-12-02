import { useState } from "react";
import axios from "axios";
import { MedicamentosTable } from "../components/MedicamentoTable";
import { SearchBar } from "../components/SearchBar";
import { useDebounce } from "../hook/useDebounce";
import MedicationFormModal from "../components/MedicationFormModal";
import ModalCadastroEstoque from "../components/ModalCadastroEstoque";
import ModalDespacho from "../components/DespachoModal"; // IMPORTADO
import { Layout } from "../components/layout";
import { API_URL } from "../constants";
import { type FormData } from "../schemas/MedicationFormModal.schema"; 

export const Dashboard = () => {
    // Busca e Filtros
    const [tabelaBusca, setTabelaBusca] = useState("");
    const debaunceBusca = useDebounce(tabelaBusca, 500);

    // Estado para forçar atualização da tabela (o segredo do update instantâneo)
    const [refreshKey, setRefreshKey] = useState(0);

    // Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCadastrarEstoqueOpen, setIsCadastrarEstoqueOpen] = useState(false);
    
    // Configurações do Modal de Despacho
    const [isDespachoOpen, setIsDespachoOpen] = useState(false);
    const [medicationToDispatch, setMedicationToDispatch] = useState<{ id: string, nome: string, estoqueAtual: number } | null>(null);

    // Configurações do Modal de Edição/Criação
    const [novoMedicamentoId, setNovoMedicamentoId] = useState<string | null>(null);
    const [editingMed, setEditingMed] = useState<(FormData & { id: string }) | undefined>(undefined);

    // --- Handlers de Abertura ---

    const handleOpenCreateModal = () => {
        setEditingMed(undefined);
        setIsModalOpen(true);
    };

    const handleOpenCadastrarEstoque = () => {
        setIsCadastrarEstoqueOpen(true);
    };

    // Chamado pela Tabela quando clica no ícone de despacho
    const handleOpenDispatch = (id: string) => {
        // Precisamos buscar detalhes rápidos ou passar via prop se a tabela tivesse tudo.
        // Como o `onDispatch` do `MedicamentosTable` só passa o ID, buscamos ou passamos dummy para abrir
        // O ideal é passar o objeto todo na tabela, vou ajustar isso abaixo.
        // Assumindo que a table passará ID. Faremos um fetch rápido ou,
        // MELHOR: Ajustar a MedicamentosTable para passar o objeto (ver passo 3).
        // AQUI, assumirei que a tabela passou o objeto completo ou buscamos.
        axios.get(`${API_URL}/medicamento/${id}`).then(res => {
            setMedicationToDispatch({
                id: res.data.id,
                nome: res.data.nome,
                estoqueAtual: res.data.estoqueTotal || res.data.estoqueAtual // Ajuste conforme seu retorno da API
            });
            setIsDespachoOpen(true);
        });
    };

    // --- Handlers de Sucesso (Update Instantâneo) ---

    const handleRefreshTable = () => {
        setRefreshKey((prev) => prev + 1); // Incrementa contador para recarregar tabela
    };

    const handleMedicationCreated = (id: string) => {
        setNovoMedicamentoId(id);
        setIsModalOpen(false); // Fecha cadastro remédio
        handleRefreshTable();  // <--- ATUALIZA TABELA INSTANTANEAMENTE
        setIsCadastrarEstoqueOpen(true); // Abre cadastro estoque
    };

    const handleDispatchSuccess = () => {
        handleRefreshTable(); // <--- ATUALIZA TABELA E REMOVE SE ESTOQUE FOR 0
    };

    // --- Edição ---
    const handleOpenEditById = async (id: string) => {
        try {
            const { data } = await axios.get(`${API_URL}/medicamento/${id}`);
            // Mapeamento conforme seu schema
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
                            {/* A prop key={refreshKey} garante que a tabela recarregue quando a key muda */}
                            <MedicamentosTable
                                key={refreshKey} 
                                searchTerm={debaunceBusca}
                                onEdit={handleOpenEditById}
                                onDispatch={handleOpenDispatch} // Passando a função
                            />
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Criação/Edição de Remédio */}
            {isModalOpen && (
                <MedicationFormModal
                    medicationData={editingMed}
                    onClose={() => setIsModalOpen(false)}
                    onSuccessCreate={handleMedicationCreated}
                    // Adicione onSuccessEdit={handleRefreshTable} se seu componente suportar para edições
                />
            )}

            {/* Modal Cadastro de Estoque Inicial */}
            {isCadastrarEstoqueOpen && (
                <ModalCadastroEstoque
                    onClose={() => {
                        setIsCadastrarEstoqueOpen(false);
                        handleRefreshTable(); // Garante refresh ao fechar/salvar
                    }}
                    open={isCadastrarEstoqueOpen}
                    defaultMedicamentoId={novoMedicamentoId ?? undefined}
                />
            )}

            {/* Modal Despacho (NOVO) */}
            {isDespachoOpen && (
                <ModalDespacho
                    open={isDespachoOpen}
                    onClose={() => setIsDespachoOpen(false)}
                    medication={medicationToDispatch}
                    onSuccess={handleDispatchSuccess}
                />
            )}
        </Layout>
    );
};