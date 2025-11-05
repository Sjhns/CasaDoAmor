// No seu App.tsx (ou Dashboard.tsx)

import { useState } from 'react'
import './App.css'
import MedicationFormModal from './components/MedicationFormModal'
import { type FormData } from './components/MedicationFormModal.schema';

// 1. IMPORTE O 'useQuery' E O 'axios'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type MedicamentoComId = FormData & { id: number | string };

// 2. CRIE A FUNÇÃO QUE BUSCA A LISTA DA API
const fetchMedicamentos = async () => {
  // Use a URL completa (com porta 8080 e CORS configurado)
  const { data } = await axios.get('http://localhost:8080/medicamento'); 
  return data;
};


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicamentoComId | undefined>(undefined); 

  // 3. O "OUVINTE" DO CACHE ESTÁ AQUI!
  // O React Query vai:
  //    a) Chamar 'fetchMedicamentos'
  //    b) Armazenar o resultado no cache com a etiqueta ['medicamentos']
  //    c) "Escutar" qualquer "aviso" (invalidate) para essa etiqueta
  const { data: medicamentos, isLoading, isError } = useQuery<MedicamentoComId[]>({
    queryKey: ['medicamentos'], // <-- A ETIQUETA EXATA!
    queryFn: fetchMedicamentos
  });

  // Funções para abrir o modal (iguais às que você já tem)
  const handleOpenCreateModal = () => {
    setEditingMed(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (medicamento: MedicamentoComId) => {
    setEditingMed(medicamento);
    setIsModalOpen(true);
  };
  
  // Função que o modal vai chamar (igual à que você já tem)
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Lógica para renderizar
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

      {/* 4. A LISTA AGORA É REAL, VINDA DA API */}
      <div style={{ padding: '10px', marginTop: '10px' }}>
        <h4>Lista de Medicamentos (Da API)</h4>
        {/* Usamos 'medicamentos || []' para o caso de a lista vir vazia */}
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