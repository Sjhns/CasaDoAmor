import { API_URL } from "../constants";

interface MedicamentoResponse {
  id: string;
  nome: string;
  lote: string;
  formaFarmaceutica: string;
  viaDeAdministracao: string;
  concentracao: string;
  categoriaTerapeutica: string;
  laboratorioFabricante: string;
  validade: string;
}

export const fetchRemedios = async (): Promise<MedicamentoResponse[]> => {
  const response = await fetch(`${API_URL}/medicamento`);

  if (!response.ok) {
    throw new Error("Erro ao buscar remédios");
  }

  return response.json();
};
