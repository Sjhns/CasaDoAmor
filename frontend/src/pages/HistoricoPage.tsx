// 1. Importamos 'React' para tipar eventos, e os tipos de useState
import React, { useState, useEffect } from 'react';
import { FiFilter, FiTrash2, FiSearch } from 'react-icons/fi';
import OperationItem from '../components/OperationItem';
import FilterModal from '../components/FilterModal';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
// Importamos nosso tipo
import type { Operation } from '../types/operation';
import { API_URL } from '../constants';

// --- DADOS MOCK (Agora usando o tipo 'Operation') ---
const mockOperations: Operation[] = [ // 2. Definimos que o array é do tipo Operation[]
  { id: 1, type: 'Cadastro Remédio', name: 'Clonazepam', date: '16/10/2025', user: 'Gustavo', level: 'Enfermeiro', obs: 'Entrada inicial do lote A.' },
  { id: 2, type: 'Adicionou ao estoque', name: 'Dipirona', date: '16/10/2025', user: 'Maria José', level: 'Farmacêutico', obs: 'Recebimento de doação.' },
  { id: 3, type: 'Despachou', name: 'Dipirona', date: '15/10/2025', user: 'Gustavo', level: 'Enfermeiro', obs: 'Paciente B, ala 3.' },
  { id: 4, type: 'Edição Remédio', name: 'Paracetamol', date: '14/10/2025', user: 'Admin', level: 'Administrador', obs: 'Correção de categoria.' },
];

export default function HistoricoPage() {
  // 3. Tipamos todos os 'useState'
  const [allOperations, setAllOperations] = useState<Operation[]>(mockOperations); 
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>(mockOperations); 
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({}); // <Record<string, any>> é um objeto
  const obterHistorico = async () => {
    const response = await fetch(`${API_URL}/historico`);
    if (! response.ok) {
      throw new Error("Erro ao buscar histórico");
    }
    const data: Operation[] = await response.json();
    setAllOperations(data);
    setFilteredOperations(data);
  };

  useEffect(() => {
    obterHistorico();
  }, []);
  
  useEffect(() => {
    let result = [...allOperations]; 
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(op => 
        op.name.toLowerCase().includes(lowerTerm) ||
        op.type.toLowerCase().includes(lowerTerm) ||
        op.user.toLowerCase().includes(lowerTerm) ||
        op.level.toLowerCase().includes(lowerTerm) ||
        op.obs.toLowerCase().includes(lowerTerm) ||
        op.date.toLowerCase().includes(lowerTerm)
      );
    }
    
    // (Lógica de filtros)
    if (activeFilters.user) {
      result = result.filter(op => op.user === activeFilters.user);
    }

    setFilteredOperations(result);

  }, [searchTerm, activeFilters, allOperations]);

  // 4. Tipamos o evento do input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />

        {/* Área de Conteúdo */}
        <main className="flex-1 p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {/* --- Header da Página --- */}
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
                    className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
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

      {/* --- Lista de Operações --- */}
      <div className="operation-list mt-16">
        {filteredOperations.length > 0 ? (
          filteredOperations.map(op => (
            <OperationItem key={op.id} operation={op} />
          ))
        ) : (
          <p className="text-center text-zinc-500 mt-10">
            Nenhuma operação encontrada para esta busca.
          </p>
        )}
      </div>

      {/* --- Modal de Filtro (Renderizado mas escondido) --- */}
      <FilterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeFilters={activeFilters}
        onFilterClick={(filter) => {
          console.log('Ativar filtro:', filter);
          // Aqui você atualizaria o 'activeFilters'
          // Ex: setActiveFilters(prev => ({ ...prev, [filterKey]: 'valor_do_filtro' }))
        }}
        onClearFilters={() => {
          setActiveFilters({});
          console.log('Filtros limpos');
        }}
      />
          </div>
        </main>
      </div>
    </div>
  );
}