import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
// Importamos o tipo que acabamos de definir
import type { Operation } from '../types/operation';

// 1. Definimos o tipo das props que este componente recebe
interface OperationItemProps {
  operation: Operation;
}

// 2. Aplicamos o tipo às props na definição da função
export default function OperationItem({ operation }: OperationItemProps) {
  // 3. Tipamos o estado (boa prática)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // O resto do código JSX é idêntico...
  const title = `${operation.type}: ${operation.name}`;

  return (
    <div className="bg-zinc-100 rounded-lg p-4 shadow-sm mb-4">
      {/* --- Seção Superior (Sempre visível) --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        {/* Esquerda: Título e Data */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-800">{title}</h3>
          <p className="sm:hidden text-sm text-zinc-500 mb-2">{operation.date}</p>
        </div>
        
        {/* Direita: Data (desktop) */}
        <div className="hidden sm:block">
          <span className="text-sm text-zinc-600">{operation.date}</span>
        </div>
      </div>

      {/* --- Seção do Meio (Sempre visível) --- */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-700 mt-2">
        <span><strong>Usuário:</strong> {operation.user}</span>
        <span><strong>Nível:</strong> {operation.level}</span>
        <span><strong>Obs.:</strong> {operation.obs.substring(0, 50)}...</span>
      </div>

      {/* --- Seção Inferior (Ações) --- */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-200">
        <button 
          className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => console.log('Abrir estoque para o item:', operation.name)}
        >
          Estoque
        </button>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-zinc-200"
          aria-label="Ver mais"
        >
          <FiChevronDown 
            className={`w-5 h-5 text-zinc-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* --- Conteúdo Expandido (Condicional) --- */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-zinc-200 text-zinc-700">
          <h4 className="font-semibold mb-2">Detalhes da Operação</h4>
          <p><strong>Observação completa:</strong> {operation.obs}</p>
          <p><strong>ID da Operação:</strong> {operation.id}</p>
        </div>
      )}
    </div>
  );
}