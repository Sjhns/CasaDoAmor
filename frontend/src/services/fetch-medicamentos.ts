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
    id: string;
    nome: string;
    lote: string;
    validade: string;
    formaFarmaceutica: string;
    concentracao: string;
    viaDeAdministracao: string;
    categoriaTerapeutica: string;
}

// info para paginacao

export interface PaginatedMedicamentosResponse {
    content: MedicamentoResponse[]; //informacoes dos medicamentos da pagina atual
    totalPages: number;
    totalElements: number;
    size: number;
    pageNumber: number;
}

// funcao aceitando os parametros
export const fetchMedicamentos = async ({
    page,
    per_page,
    search,
    sort_by,
    sort_dir,
}: FetchMedicamentosParams): Promise<PaginatedMedicamentosResponse> => {
    const params = new URLSearchParams();

    // mapeamento do retorno do hook

    params.append("page", (page - 1).toString());
    params.append("size", per_page.toString());

    if (search) {
        params.append("search", search);
    }

    if (sort_by && sort_dir) {
        params.append("sort", `${sort_by},${sort_dir}`);
    }

    const response = await fetch(
        `${API_URL}/medicamentos?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error("Erro na Busca do Remedio");
    }

    return response.json();
};
