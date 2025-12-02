import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import type { Operation } from '../types/operation';

interface OperationItemProps {
  operation: Operation;
}

export default function OperationItem({ operation }: OperationItemProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isSaida = operation.type === 'SAIDA';
  const isEntrada = operation.type === 'ENTRADA' || operation.type === 'CADASTRO';
  
  const typeColor = isSaida ? "text-red-700 bg-red-50" : (isEntrada ? "text-green-700 bg-green-50" : "text-gray-700 bg-gray-100");

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3 hover:shadow-md transition-shadow">
      {/* --- Seção Superior --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${typeColor}`}>
                {operation.type}
            </span>
            <span className="text-xs text-gray-400">{operation.date}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{operation.name}</h3>
        </div>
      </div>

      {/* --- Seção do Meio --- */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mt-3">
        {/* Usuário (Quem fez a ação) */}
        <span>
            <strong className="text-gray-900">Usuário:</strong> {operation.user}
        </span>

        {/* Paciente (Quem recebeu - antigo Destinatário) */}
        {operation.recipient && (
            <span>
                <strong className="text-gray-900">Paciente:</strong> {operation.recipient}
            </span>
        )}

        {/* Resumo da Obs */}
        {!isExpanded && (
            <span className="text-gray-500 italic truncate max-w-xs">
                {operation.obs}
            </span>
        )}
      </div>

      {/* --- Botão Ver Mais --- */}
      <div className="flex justify-end mt-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          {isExpanded ? "Menos detalhes" : "Ver detalhes"}
          <FiChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* --- Conteúdo Expandido --- */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-700 animate-fadeIn">
          <p><strong className="text-gray-900">Observação Completa:</strong></p>
          <p className="mt-1 bg-gray-50 p-2 rounded text-gray-600">{operation.obs}</p>
          <p className="mt-2 text-xs text-gray-400">ID do Registro: {operation.id}</p>
        </div>
      )}
    </div>
  );
}