import { useState } from "react";
import { denominacoesService } from "../services/denominacoesGenericas";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DenominacaoGenericaFormModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [nome, setNome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setError("O nome não pode estar vazio.");
      return;
    }

    try {
      setIsSubmitting(true);
      await denominacoesService.create(nome.trim());
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao criar denominação genérica.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          Adicionar Denominação Genérica
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Ex: Dipirona"
            />
            {error && <p className="text-red-500 text-xs mt-1">⚠ {error}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white text-sm ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
