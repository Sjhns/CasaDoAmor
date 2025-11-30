import { FiX } from 'react-icons/fi';

// 1. Definimos o tipo dos filtros ativos.
// 'Record<string, any>' é um jeito flexível de dizer "é um objeto
// com chaves string e valores de qualquer tipo".
type ActiveFilters = Record<string, any>; 

// 2. Definimos as props do Modal
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void; // Função que não recebe nada e não retorna nada
  activeFilters: ActiveFilters;
  onFilterClick: (filter: string) => void; // Função que recebe uma string
  onClearFilters: () => void;
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  activeFilters, 
  onFilterClick, 
  onClearFilters 
}: FilterModalProps) {
  
  if (!isOpen) return null;

  const filters = [
    'Data', 'Tipo de operação', 'Usuário', 'Nível de permissão', 
    'Remédio', 'Categoria de remédio', 'Tipo de remédio', 'Observação'
  ];

  const isFilterActive = (filterName: string) => {
    // Exemplo: 'Tipo de operação' vira 'tipoDeOperacao'
    const filterKey = filterName.toLowerCase().replace(' ', ''); // Simplificação
    return !!activeFilters[filterKey]; // Checa se a chave existe
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-center items-center"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filtrar por:</h2>
          <button 
            onClick={onClearFilters}
            className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Limpar filtros
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = isFilterActive(filter); 
            return (
              <button
                key={filter}
                onClick={() => onFilterClick(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-sky-500 text-white hover:bg-sky-600' 
                    : 'bg-zinc-200 text-zinc-700 hover:bg-sky-500 hover:text-white'}
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-zinc-500">(Área para os inputs dos filtros)</p>
        </div>
      </div>
    </div>
  );
}