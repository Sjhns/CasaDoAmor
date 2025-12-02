import axios from "axios";
import { API_URL } from "../constants";

export interface DenominacaoGenericaDTO {
  id: string;
  nome: string;
}

export const denominacoesService = {
  async listAll(): Promise<DenominacaoGenericaDTO[]> {
    const response = await axios.get(`${API_URL}/denominacao-generica`);
    return response.data;
  },

  async create(nome: string): Promise<DenominacaoGenericaDTO> {
    const response = await axios.post(`${API_URL}/denominacao-generica`, {
      nome,
    });
    return response.data;
  },
};
