import React, { useState, useEffect, useCallback } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import OperationItem from "../components/OperationItem";
// --- CERTIFIQUE-SE DESTE IMPORT ---
import FilterModal from "../components/FilterModal"; 
import type { Operation } from "../types/operation";
import { API_URL } from "../constants";
import { Layout } from "../components/layout";

type ActiveFilters = Record<string, string>;

export default function HistoricoPage() {
  const [allOperations, setAllOperations] = useState<Operation[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // --- AQUI ESTAVA O ERRO DE "Cannot find name" ---
  // Precisamos definir o estado activeFilters e sua função setActiveFilters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  type BackendHistoricoDTO = {
    idHistorico: string;
    tipo?: string | null;
    medicamentoNome?: string | null;
    dataMovimentacao: string | Date;
    usuarioNome?: string | null;
    destinatario?: string | null;
    observacao?: string | null;
  };

  const mapBackendToOperation = (dto: BackendHistoricoDTO): Operation => {
    return {
      id: dto.idHistorico,
      type: dto.tipo ?? "Operação",
      name: dto.medicamentoNome ?? "Não informado",
      date: new Date(dto.dataMovimentacao).toLocaleString("pt-BR"),
      user: dto.usuarioNome ?? "Sistema",
      recipient: dto.destinatario ?? undefined,
      level: "N/A",
      obs: dto.observacao ?? "",
    };
  };

  // useCallback resolve o aviso de dependência do useEffect
  const obterHistorico = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "1000");
      params.append("sort", "dataMovimentacao,desc");

      // Adiciona filtros se existirem em activeFilters
      if (activeFilters.tipo) params.append("tipo", activeFilters.tipo);
      if (activeFilters.usuario) params.append("usuario", activeFilters.usuario);
      if (activeFilters.medicamento) params.append("medicamento", activeFilters.medicamento);

      const response = await fetch(`${API_URL}/api/historico?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar histórico");
      }

      const data = await response.json();
      const lista = Array.isArray(data) ? data : data.content;
      const safeLista = Array.isArray(lista) ? lista : [];
      
      const operations: Operation[] = safeLista.map(mapBackendToOperation);

      setAllOperations(operations);
      setFilteredOperations(operations);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, [activeFilters]); // Recarrega quando os filtros mudam

  useEffect(() => {
    obterHistorico();
  }, [obterHistorico]);

  // Filtros locais (Busca textual simples na lista já carregada)
  useEffect(() => {
    let result = [...allOperations];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (op) =>
          op.name.toLowerCase().includes(lowerTerm) ||
          op.type.toLowerCase().includes(lowerTerm) ||
          op.user.toLowerCase().includes(lowerTerm) ||
          op.obs.toLowerCase().includes(lowerTerm) ||
          op.date.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredOperations(result);
  }, [searchTerm, allOperations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <main className="flex-1 bg-gray-50 p-2">
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-zinc-800 mb-4 text-center">
                Histórico de Operações
              </h1>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-16">
              <div className="relative flex-1 max-w-lg">
                <input
                  type="text"
                  placeholder="Pesquise por usuário, remédio, tipo..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-4 pr-10 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2.5 border border-zinc-300 rounded-lg hover:bg-zinc-100 flex items-center gap-2 text-zinc-700 transition-colors"
                  aria-label="Filtrar"
                >
                  <FiFilter className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">Filtros</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tag visual de Filtro Ativo */}
          {Object.keys(activeFilters).length > 0 && (
              <div className="mb-4 flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
                  <span className="font-bold">Filtro Ativo:</span>
                  {activeFilters.tipo && <span>Tipo: {activeFilters.tipo}</span>}
                  {activeFilters.usuario && <span>Usuário: {activeFilters.usuario}</span>}
                  {activeFilters.medicamento && <span>Remédio: {activeFilters.medicamento}</span>}
                  <button 
                    onClick={() => setActiveFilters({})}
                    className="ml-auto text-xs underline hover:text-blue-900"
                  >
                    Limpar
                  </button>
              </div>
          )}

          <div className="mt-8 space-y-3">
            {filteredOperations.length > 0 ? (
              filteredOperations.map((op) => (
                <OperationItem key={op.id} operation={op} />
              ))
            ) : (
              <div className="text-center py-12">
                  <p className="text-zinc-500">Nenhuma operação encontrada.</p>
              </div>
            )}
          </div>

          <FilterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activeFilters={activeFilters}
            onApplyFilters={(newFilters) => {
              setActiveFilters(newFilters);
            }}
            onClearFilters={() => {
              setActiveFilters({});
            }}
          />
        </div>
      </div>
      </main>
    </Layout>
  );
}