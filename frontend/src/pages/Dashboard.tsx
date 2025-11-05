import {
  Search,
  Filter,
  ArrowRight,
  Pencil,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRemedios } from "../services/fetch-remedios";

interface Remedio {
  id: string;
  nome: string;
  lote: string;
  tipo: string;
  vencimento: string;
  proposito: string;
  status: "normal" | "atencao" | "vencido";
}

export const Dashboard = () => {
  const [buscaQuery, setBuscaQuery] = useState("");
  const [tabelaBuscaQuery, setTabelaBuscaQuery] = useState("");
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Service para buscar remédios
  const getRemedios = async () => {
    try {
      setLoading(true);

      const data = await fetchRemedios();

      const remediosMapeados: Remedio[] = data.map((item) => ({
        id: item.id,
        nome: item.nome,
        lote: item.lote,
        tipo: item.formaFarmaceutica,
        vencimento: new Date(
          new Date(item.validade).getTime() + 24 * 60 * 60 * 1000
        ).toLocaleDateString("pt-BR"),
        proposito: item.categoriaTerapeutica,
        status: getStatusByDate(item.validade),
      }));

      setRemedios(remediosMapeados);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Função para determinar o status baseado na data de vencimento
  const getStatusByDate = (
    validade: string
  ): "normal" | "atencao" | "vencido" => {
    const dataVencimento = new Date(validade);
    const hoje = new Date();

    // Zerar as horas para comparar apenas as datas
    dataVencimento.setHours(0, 0, 0, 0);
    dataVencimento.setDate(dataVencimento.getDate() + 1); // Correção da data
    hoje.setHours(0, 0, 0, 0);

    const diasParaVencer = Math.ceil(
      (dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasParaVencer < 0) {
      return "vencido";
    } else if (diasParaVencer <= 30) {
      return "atencao";
    } else {
      return "normal";
    }
  };

  // Filtrar remédios baseado na busca
  const remediosFiltrados = remedios.filter(
    (remedio) =>
      remedio.nome.toLowerCase().includes(tabelaBuscaQuery.toLowerCase()) ||
      remedio.lote.toLowerCase().includes(tabelaBuscaQuery.toLowerCase()) ||
      remedio.tipo.toLowerCase().includes(tabelaBuscaQuery.toLowerCase())
  );

  // Buscar remédios ao montar o componente
  useEffect(() => {
    getRemedios();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-700 text-lg">Carregando remédios...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-600 flex">
      {/* Barra Lateral */}
      <aside className="w-56 bg-sky-600 text-white p-6 flex flex-col">
        <div className="mb-12 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-red-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                <div className="w-full h-0.5 bg-red-500 absolute top-1/2 transform -translate-y-1/2 rotate-45"></div>
                <div className="w-full h-0.5 bg-red-500 absolute top-1/2 transform -translate-y-1/2 -rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <button className="w-full text-white rounded-lg px-4 py-3 text-left font-medium hover:bg-sky-500 transition-colors cursor-pointer">
            Estoque
          </button>
          <button className="w-full text-white rounded-lg px-4 py-3 text-left font-medium hover:bg-sky-500 transition-colors cursor-pointer">
            Perfil
          </button>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra Superior */}
        <header className="bg-sky-600 px-8 py-2 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquise algo"
                value={buscaQuery}
                onChange={(e) => setBuscaQuery(e.target.value)}
                className="w-full bg-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 placeholder-gray-500 focus:outline-none "
              />

              <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center  rounded-r-lg transition-colors cursor-pointer">
                <Search className="text-gray-500 w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 bg-gray-50 p-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 h-full">
            {/* <div> */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Estoque geral de remédios
            </h1>

            {/* Busca e Ações */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 max-w-2xl relative">
                <input
                  type="text"
                  placeholder="Buscar remédio..."
                  value={tabelaBuscaQuery}
                  onChange={(e) => setTabelaBuscaQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-6 h-6 text-gray-700" />
              </button>
              <button className="bg-sky-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-600 transition-colors">
                Cadastrar categoria
              </button>
              <button className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                Adicionar remédio
              </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      NOME
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Lote
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Vencimento
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Propósito
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {remediosFiltrados.map((remedio, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 transition-colors ${
                        remedio.status === "vencido"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium">
                        {remedio.id.slice(0, 6)}...
                      </td>
                      <td className="px-6 py-4">{remedio.nome}</td>
                      <td className="px-6 py-4">{remedio.lote}</td>
                      <td className="px-6 py-4">{remedio.tipo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-5">
                          {remedio.vencimento}
                          {remedio.status === "atencao" && (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          )}
                          {remedio.status === "vencido" && (
                            <X className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{remedio.proposito}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            className={`p-1.5 hover:bg-opacity-10 rounded transition-colors ${
                              remedio.status === "vencido"
                                ? "hover:bg-white"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <ArrowRight
                              className={`w-5 h-5 ${
                                remedio.status === "vencido"
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                          <button
                            className={`p-1.5 hover:bg-opacity-10 rounded transition-colors ${
                              remedio.status === "vencido"
                                ? "hover:bg-white"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <Pencil
                              className={`w-5 h-5 ${
                                remedio.status === "vencido"
                                  ? "text-white"
                                  : "text-green-500"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              {!error && remediosFiltrados.length === 0 && (
                <span className="text-gray-700 text-lg text-center block">
                  Nenhum remédio encontrado para "{tabelaBuscaQuery}"
                </span>
              )}
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-100 border border-red-400 rounded-lg flex flex-col justify-center items-center">
                <span>
                  <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                </span>
                <p className="flex items-center gap-2 text-lg font-semibold">
                  Tivemos um problema ao carregar os remédios
                </p>

                <div className="mt-4 font-medium">{error}</div>
              </div>
            )}

            {remediosFiltrados.length > 0 && (
              <div className="mt-8 text-gray-600 text-center">
                Total de remédios: {remediosFiltrados.length}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
