import { API_URL } from "../constants";

// parametros pro hook
export interface FetchMedicamentosParams {
    page: number;
    per_page: number;
    search?: string;
    sort_by?: string;
    sort_dir?: "asc" | "desc";
}

// RESPOSTA DA API (Atualizada com a lista de estoques)
export interface MedicamentoResponse {
    idMedicamento: string;
    nomeMedicamento: string;
    quantidadeTotalEstoque: number; // ou optional, dependendo do back
    lote?: string | null;
    validade?: string | null;
    formaFarmaceutica: string;
    concentracao: string;
    viaDeAdministracao: string;
    categoriaTerapeutica: string;

    // --- NOVO CAMPO: Lista de Estoques para o Accordion ---
    estoques?: {
        id: string;
        lote: string;
        quantidade: number;
        validadeAposAberto: string; // O Java manda LocalDate, aqui chega string "yyyy-mm-dd"
        status: string;
    }[];
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

    params.append("page", page.toString());
    params.append("per_page", per_page.toString());

    if (search) {
        params.append("search", search);
    }

    if (sort_by) {
        params.append("sort_by", sort_by);
    }
    if (sort_dir) {
        params.append("sort_dir", sort_dir);
    }

    const response = await fetch(`${API_URL}/medicamento?${params.toString()}`);

    if (response.ok) {
        return response.json();
    }

    throw new Error(`Erro na Busca do Remedio: ${response.status}`);
};