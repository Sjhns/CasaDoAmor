import axios from "axios";
import type { Notification } from "../types/notification";

const API_URL = "http://localhost:8080/api/notificacoes";

export interface NotificationResponse {
    id: number;
    tipoAlerta: string;
    mensagem: string;
    nomeMedicamento: string;
    dataVencimento: string | null;
    quantidade: number | null;
    dataCriacao: string;
    lida: boolean;
}

const mapTipoAlerta = (
    tipo: string
): "quase-vencido" | "vencido" | "quase-esgotado" | "esgotado" => {
    switch (tipo) {
        case "ESTOQUE_CRITICO":
            return "quase-esgotado";
        case "VENCIDO":
            return "vencido";
        case "PROXIMO_VENCIMENTO":
            return "quase-vencido";
        case "ESGOTADO":
            return "esgotado";
        default:
            // Fallback: trata qualquer outro como quase-esgotado para não quebrar UI
            return "quase-esgotado";
    }
};

const mapNotificationFromAPI = (
    apiNotification: NotificationResponse
): Notification => {
    return {
        id: apiNotification.id,
        type: mapTipoAlerta(apiNotification.tipoAlerta),
        medicineName: apiNotification.nomeMedicamento,
        expiryDate: apiNotification.dataVencimento
            ? new Date(apiNotification.dataVencimento)
            : undefined,
        quantity: apiNotification.quantidade || undefined,
        createdAt: new Date(apiNotification.dataCriacao),
        read: apiNotification.lida,
    };
};

export const notificationService = {
    async getUnread(): Promise<Notification[]> {
        const response = await axios.get<NotificationResponse[]>(
            `${API_URL}/nao-lidas`
        );
        return response.data.map(mapNotificationFromAPI);
    },

    async getAll(): Promise<Notification[]> {
        const response = await axios.get<NotificationResponse[]>(API_URL);
        return response.data.map(mapNotificationFromAPI);
    },

    async markAsRead(id: number): Promise<void> {
        await axios.put(`${API_URL}/${id}/marcar-lida`);
    },

    async markAllAsRead(): Promise<void> {
        await axios.put(`${API_URL}/marcar-todas-lidas`);
    },

    async remove(id: number): Promise<void> {
        await axios.delete(`${API_URL}/${id}`);
    },
};
