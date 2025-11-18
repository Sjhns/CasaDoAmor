// Este arquivo simula a resposta do hook useMedicamentos
// Use-o durante o desenvolvimento para não depender do backend

// Simula a interface de resposta que o React Query espera
const mockData = {
    content: [
        {
            id: "1a2b3c",
            nome: "Paracetamol 500mg",
            lote: "LOTE-123",
            formaFarmaceutica: "Comprimido",
            categoriaTerapeutica: "Analgésico",
            validade: "2025-12-31T00:00:00",
        },
        {
            id: "4d5e6f",
            nome: "Dipirona 1g",
            lote: "LOTE-456",
            formaFarmaceutica: "Gotas",
            categoriaTerapeutica: "Analgésico",
            validade: "2024-11-20T00:00:00", // Data próxima para testar o 'atencao'
        },
        {
            id: "7g8h9i",
            nome: "Amoxicilina",
            lote: "LOTE-789",
            formaFarmaceutica: "Cápsula",
            categoriaTerapeutica: "Antibiótico",
            validade: "2023-01-10T00:00:00", // Data vencida para testar o 'vencido'
        },
    ],
    totalPages: 2,
    totalElements: 6,
    size: 3,
    number: 0,
};

// Criamos uma função com a *mesma assinatura* do hook original
export const useMedicamentos = (params: unknown) => {
    console.log("Chamando hook MOCK de medicamentos com params:", params);

    return {
        data: mockData,
        isLoading: false, // Defina como true para testar o skeleton
        isError: false, // Defina como true para testar a tela de erro
        refetch: () => console.log("Refetch (mock) chamado!"),
    };
};
