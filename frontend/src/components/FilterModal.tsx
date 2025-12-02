import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

type FilterType = "tipo" | "usuario" | "medicamento" | "destinatario" | "";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: Record<string, string>;
  onApplyFilters: (filters: Record<string, string>) => void;
  onClearFilters: () => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  activeFilters,
  onApplyFilters,
  onClearFilters,
}: FilterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterType>("tipo");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      const keys = Object.keys(activeFilters);
      if (keys.length > 0) {
        const firstKey = keys[0] as FilterType;
        setSelectedCategory(firstKey);
        setFilterValue(activeFilters[firstKey]);
      } else {
        setSelectedCategory("tipo");
        setFilterValue("");
      }
    }
  }, [isOpen, activeFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    const newFilters: Record<string, string> = {};
    if (filterValue.trim()) {
        newFilters[selectedCategory] = filterValue;
    }
    onApplyFilters(newFilters);
    onClose();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as FilterType);
    setFilterValue(""); 
  };

  const renderSecondInput = () => {
    switch (selectedCategory) {
        case "tipo":
            return (
                <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">Selecione a operação...</option>
                    <option value="ENTRADA">Entrada (Cadastro de Estoque)</option>
                    <option value="SAIDA">Saída (Despacho)</option>
                    <option value="EDICAO">Edição</option>
                    <option value="SISTEMA">Sistema (Automático)</option>
                    {/* OPÇÃO 'CADASTRO' REMOVIDA AQUI */}
                </select>
            );
        
        case "usuario":
            return (
                <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Digite o nome do usuário..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            );

        case "medicamento":
            return (
                <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Digite o nome do remédio..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            );

        default:
            return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Filtrar Histórico</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Filtrar por:</label>
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="tipo">Tipo de Movimentação</option>
                    <option value="usuario">Usuário Responsável</option>
                    <option value="medicamento">Nome do Medicamento</option>
                </select>
            </div>

            <div className="flex flex-col gap-2 animate-fadeIn">
                <label className="text-sm font-semibold text-gray-700">
                    {selectedCategory === 'tipo' ? 'Selecione:' : 'Contém o termo:'}
                </label>
                {renderSecondInput()}
            </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <button
                onClick={() => {
                    onClearFilters();
                    onClose();
                }}
                className="text-sm text-red-600 hover:underline font-medium"
            >
                Limpar filtros
            </button>

            <button
                onClick={handleApply}
                disabled={!filterValue}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Check size={18} />
                Aplicar Filtro
            </button>
        </div>
      </div>
    </div>
  );
}