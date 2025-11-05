import { useState } from 'react'
import './App.css'
import MedicationFormModal from './components/MedicationFormModal'
import { type FormData } from './components/MedicationFormModal.schema';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type MedicamentoComId = FormData & { id: number | string };

const fetchMedicamentos = async () => {
  const { data } = await axios.get('http://localhost:8080/medicamento'); 
  return data;
};


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicamentoComId | undefined>(undefined); 

  const { data: medicamentos, isLoading, isError } = useQuery<MedicamentoComId[]>({
    queryKey: ['medicamentos'], 
    queryFn: fetchMedicamentos
  });
  
  const handleOpenCreateModal = () => {
    setEditingMed(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (medicamento: MedicamentoComId) => {
    setEditingMed(medicamento);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div>Carregando medicamentos...</div>
  }

  if (isError) {
    return <div>Erro ao carregar os dados. O back-end está no ar?</div>
  }

  return (
    <div>
      <button onClick={handleOpenCreateModal}>
        Criar Novo Medicamento
      </button>

      <hr />

      <div style={{ padding: '10px', marginTop: '10px' }}>
        <h4>Lista de Medicamentos (Da API)</h4>
        {(medicamentos || []).map((med) => (
          <div key={med.id} style={{ border: '1px solid #ccc', margin: '5px' }}>
            <p>Nome: {med.nomeCaixa}</p>
            <button onClick={() => handleOpenEditModal(med)}>
              Editar
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <MedicationFormModal 
          medicationData={editingMed} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App