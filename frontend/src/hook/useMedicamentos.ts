import { useQuery } from "@tanstack/react-query";
import {
    fetchMedicamentos,
    type FetchMedicamentosParams,
} from "../services/fetch-medicamentos";

// hook recebe os mesmos parametros da funcao fetch

export const useMedicamentos = (params: FetchMedicamentosParams) => {
    const { data, isLoading, isError, refetch } = useQuery({
        // chave unica, medicamentos como a chave
        queryKey: ["medicamentos", params],
        queryFn: () => fetchMedicamentos(params),

        // manter os dados anteriores para evitar loading de mais
    });
    return {
        data,
        isLoading,
        isError,
        refetch,
    };
};
