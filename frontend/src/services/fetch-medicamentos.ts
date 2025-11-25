import { API_URL } from "../constants";

// parametros pro hook
export interface FetchMedicamentosParams {
  page: number;
  per_page: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

// resposta da api
export interface MedicamentoResponse {
  formaFarmaceutica: string;
  concentracao: string;
  viaDeAdministracao: string;
  categoriaTerapeutica: string;
  idMedicamento: string;
  nomeMedicamento: string;
  lote?: string | null;
  validade?: string | null;
}

// info para paginacao

export interface PaginatedMedicamentosResponse {
  itens: MedicamentoResponse[];
  paginaAtual: number;
  quantidadeItensSolicitados: number;

  totalRegistrosEncontrados: number;
}


export const fetchMedicamentos = async ({
  page,
  per_page,
  search,
  sort_by,
  sort_dir,
}: FetchMedicamentosParams): Promise<PaginatedMedicamentosResponse> => {
  const params = new URLSearchParams();

  // mapeamento do retorno do hook

  params.append("page", page.toString());
  params.append("size", per_page.toString());

  if (search) {
    params.append("search", search);
  }

  if (sort_by && sort_dir) {
    params.append("sort", `${sort_by},${sort_dir}`);
  }

  // se o page for zero ou negativo, deve corrigir para 1

  const response = await fetch(`${API_URL}/medicamento?${params.toString()}`);

  if (response.ok) {
    return response.json();
  }

  throw new Error(`Erro na Busca do Remedio: ${response.status}`);
};
