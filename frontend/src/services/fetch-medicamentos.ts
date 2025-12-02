import { API_URL } from "../constants";

export interface FetchMedicamentosParams {
    page: number;
    per_page: number;
    search?: string;
    sort_by?: string;
    sort_dir?: "asc" | "desc";
}

// RESPOSTA DA API COMPLETA
export interface MedicamentoResponse {
    idMedicamento: string;
    nomeMedicamento: string;
    quantidadeTotalEstoque: number;
    lote?: string | null;
    validade?: string | null;
    
    // Detalhes técnicos
    formaFarmaceutica: string;
    concentracao: string;
    viaDeAdministracao: string;
    categoriaTerapeutica: string;
    
    // --- CAMPOS ADICIONADOS PARA CORRIGIR O ERRO ---
    laboratorioFabricante?: string | null; // <--- Esse é o culpado do erro atual
    estoqueMinimo?: number | null;
    estoqueMaximo?: number | null;

    // Lista de estoques para o accordion
    estoques?: {
        id: string;
        lote: string;
        quantidade: number;
        validadeAposAberto: string;
        status: string;
    }[];
}

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