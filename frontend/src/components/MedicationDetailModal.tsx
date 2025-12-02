import { X, Package, AlertTriangle, CheckCircle } from "lucide-react"; // <--- Calendar removido
import type { MedicamentoResponse } from "../services/fetch-medicamentos";
import { getStatusByDate } from "../utils"; 

interface MedicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicamento: MedicamentoResponse | null;
}

export default function MedicationDetailsModal({
  isOpen,
  onClose,
  medicamento,
}: MedicationDetailsModalProps) {
  if (!isOpen || !medicamento) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
  };

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Package size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{medicamento.nomeMedicamento}</h2>
                <p className="text-xs text-gray-500 font-mono">ID: {medicamento.idMedicamento}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollável) */}
        <div className="p-6 overflow-y-auto space-y-8">
            
            {/* Seção 1: Dados Cadastrais */}
            <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
                    Informações do Medicamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <DetailItem label="Forma Farmacêutica" value={medicamento.formaFarmaceutica} />
                    <DetailItem label="Concentração" value={medicamento.concentracao} />
                    <DetailItem label="Via de Administração" value={medicamento.viaDeAdministracao} />
                    <DetailItem label="Categoria Terapêutica" value={medicamento.categoriaTerapeutica} />
                    <DetailItem label="Laboratório" value={medicamento.laboratorioFabricante} /> 
                </div>
            </section>

            {/* Seção 2: Estoque e Lotes */}
            <section>
                <div className="flex justify-between items-end mb-4 border-b pb-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Estoque e Lotes
                    </h3>
                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        Total: <strong>{medicamento.quantidadeTotalEstoque}</strong> un
                    </span>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-4 py-3">Lote</th>
                                <th className="px-4 py-3">Validade</th>
                                <th className="px-4 py-3">Quantidade</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {medicamento.estoques && medicamento.estoques.length > 0 ? (
                                medicamento.estoques.map((est, idx) => {
                                    const dataValidade = est.validadeAposAberto || "";
                                    const status = dataValidade ? getStatusByDate(dataValidade) : "ok";
                                    
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{est.lote}</td>
                                            <td className="px-4 py-3 text-gray-600">{formatDate(dataValidade)}</td>
                                            <td className="px-4 py-3 font-bold text-gray-800">{est.quantidade}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={status} />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">
                                        Nenhum lote registrado. Estoque zerado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ label, value }: { label: string, value?: string | null }) => (
    <div>
        <span className="block text-xs font-medium text-gray-500 uppercase">{label}</span>
        <span className="block text-base font-medium text-gray-900 mt-0.5">{value || "-"}</span>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    if (status === "vencido") {
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded"><AlertTriangle size={12}/> Vencido</span>;
    }
    if (status === "atencao") {
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded"><AlertTriangle size={12}/> Vence Breve</span>;
    }
    return <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded"><CheckCircle size={12}/> Regular</span>;
};