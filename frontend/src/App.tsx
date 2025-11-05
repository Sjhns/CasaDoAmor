import { useState } from 'react'
import './App.css'
import MedicationFormModal from './components/MedicationFormModal'
import { type FormData } from './components/MedicationFormModal.schema';

type MedicamentoComId = FormData & { id: number | string };
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 3. Defina o tipo do estado e inicie com 'undefined'
  const [editingMed, setEditingMed] = useState<MedicamentoComId | undefined>(undefined); 

  const handleOpenCreateModal = () => {
    // 4. Mude de 'null' para 'undefined'
    setEditingMed(undefined); // Sem dados = Modo Criação
    setIsModalOpen(true);
  };

  // 5. Use o tipo na função (erro 'any' resolvido!)
  const handleOpenEditModal = (medicamento: MedicamentoComId) => {
    setEditingMed(medicamento); // Com dados = Modo Edição
    setIsModalOpen(true);
  };
const mockMedicamento: MedicamentoComId = {
    id: 123, // ID de teste
    nomeCaixa: "Dipirona (Teste)",
    nomeGenerico: "Dipirona Sódica",
    codigo: "MOCK123",
    lote: "LOTE-DE-TESTE",
    validade: "2025-12-31", // Lembre-se que definimos como string
    apelido: "Dipi",
    descricao: "Este é um remédio de teste para edição."
  };

  return (
    <div>
      <button onClick={handleOpenCreateModal}>
        Criar Novo Medicamento (Testar)
      </button>

      <hr />

      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        <h4>Item de Remédio (Exemplo)</h4>
        <p>Nome: {mockMedicamento.nomeCaixa}</p>
        
        <button onClick={() => handleOpenEditModal(mockMedicamento)}>
          Editar (Testar)
        </button>
      </div>

      {isModalOpen && (
        <MedicationFormModal 
          medicationData={editingMed} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
export default App
