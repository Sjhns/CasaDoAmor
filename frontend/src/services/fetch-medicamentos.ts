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

    if (response.ok) {
        return response.json();
    }

    // Se o endpoint paginado não existir (404), tentar buscar no endpoint sem paginação
    if (response.status === 404) {
        // Alguns backends usam rota singular '/medicamento' para listar todos
        const fallbackResp = await fetch(`${API_URL}/medicamento`);

        if (!fallbackResp.ok) {
            throw new Error(
                `Erro na Busca do Remedio (fallback): ${fallbackResp.status}`
            );
        }

        const all: MedicamentoResponse[] = await fallbackResp.json();

        // Adaptar para o formato paginado esperado pelo frontend
        const startIndex = (page - 1) * per_page;
        const pageItems = all.slice(startIndex, startIndex + per_page);

        return {
            content: pageItems,
            totalPages: Math.max(1, Math.ceil(all.length / per_page)),
            totalElements: all.length,
            size: pageItems.length,
            pageNumber: page - 1,
        };
    }

    throw new Error(`Erro na Busca do Remedio: ${response.status}`);
};
