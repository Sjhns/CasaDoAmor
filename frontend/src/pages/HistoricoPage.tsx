import React, { useState, useEffect } from "react";
import { FiFilter, FiTrash2, FiSearch } from "react-icons/fi";
import OperationItem from "../components/OperationItem";
import FilterModal from "../components/FilterModal";
import type { Operation } from "../types/operation";
import { API_URL } from "../constants";
import { Layout } from "../components/layout";

export default function HistoricoPage() {
  const [allOperations, setAllOperations] = useState<Operation[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  type BackendHistoricoDTO = {
    idHistorico: string;
    tipo?: string | null;
    medicamentoNome?: string | null;
    dataMovimentacao: string | Date;
    usuarioNome?: string | null;
    observacao?: string | null;
  };

  const mapBackendToOperation = (dto: BackendHistoricoDTO): Operation => {
    return {
      id: dto.idHistorico,
      type: dto.tipo ?? "Operação",
      name: dto.medicamentoNome ?? "Não informado",
      date: new Date(dto.dataMovimentacao).toLocaleDateString("pt-BR"),
      user: dto.usuarioNome ?? "Sistema",
      level: "N/A", // backend não envia, deixei padrão
      obs: dto.observacao ?? "",
    };
  };

  const obterHistorico = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/historico?page=0&size=1000&sort=dataMovimentacao,desc`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar histórico");
      }

      const data = await response.json();

      // Se o backend usa Page<?> → data.content
      const lista = Array.isArray(data) ? data : data.content;

      const operations: Operation[] = lista.map(mapBackendToOperation);

      setAllOperations(operations);
      setFilteredOperations(operations);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  useEffect(() => {
    obterHistorico();
  }, []);

  // ============================
  // 🔎 FILTROS + BUSCA
  // ============================
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

    if (activeFilters.user) {
      result = result.filter((op) => op.user === activeFilters.user);
    }

    setFilteredOperations(result);
  }, [searchTerm, activeFilters, allOperations]);

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
                  className="w-full pl-4 pr-10 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 border border-zinc-300 rounded-lg hover:bg-zinc-100"
                  aria-label="Filtrar"
                >
                  <FiFilter className="w-5 h-5 text-zinc-700" />
                </button>
                <button
                  className="p-2 border border-zinc-300 rounded-lg hover:bg-zinc-100"
                  aria-label="Limpar histórico"
                >
                  <FiTrash2 className="w-5 h-5 text-zinc-700" />
                </button>
              </div>
            </div>
          </div>

          <div className="operation-list mt-16">
            {filteredOperations.length > 0 ? (
              filteredOperations.map((op) => (
                <OperationItem key={op.id} operation={op} />
              ))
            ) : (
              <p className="text-center text-zinc-500 mt-10">
                Nenhuma operação encontrada para esta busca.
              </p>
            )}
          </div>

          <FilterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activeFilters={activeFilters}
            onFilterClick={(filter) => {
              console.log("Ativar filtro:", filter);
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
