import { Search, PackageOpen, User } from "lucide-react";
import { useState } from "react";
// import MedicationFormModal from "../components/MedicationFormModal";
import { MedicamentosTable } from "../components/MedicamentoTable";
import { SearchBar } from "../components/SearchBar";
import { useDebounce } from "../hook/useDebounce";

export const Dashboard = () => {
    const [buscaQuery, setBuscaQuery] = useState("");

    // busca na tabela
    const [tabelaBusca, setTabelaBusca] = useState("");
    // delay usando debounce
    const debaunceBusca = useDebounce(tabelaBusca, 500); // 500 ms

    // const [tabelaBuscaQuery, setTabelaBuscaQuery] = useState("");

    // const handleOpenCreateModal = () => {
    //     setEditingMed(undefined);
    //     setIsModalOpen(true);
    // };

    // const handleOpenEditModal = (medicamento: MedicamentoComId) => {
    //     setEditingMed(medicamento);
    //     setIsModalOpen(true);
    // };

    // const handleCloseModal = () => {
    //     setIsModalOpen(false);
    // };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-sky-500 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                <div className="w-full md:flex-1 md:max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Pesquise algo"
                            value={buscaQuery}
                            onChange={(e) => setBuscaQuery(e.target.value)}
                            className="w-full bg-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 placeholder-gray-500 focus:outline-none"
                        />
                        <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center rounded-r-lg transition-colors cursor-pointer">
                            <Search className="text-gray-500 w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right hidden md:block">
                        <p className="text-white font-medium text-sm">
                            Casa do Amor
                        </p>
                        <p className="text-sky-100 text-xs">Administrador</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center border-white rounded-full bg-white hover:bg-sky-50 transition-colors cursor-pointer">
                        <img
                            src="https://api.dicebear.com/9.x/adventurer/svg?seed=CasaDoAmor"
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row h-full">
                {/* Sidebar */}
                <aside className="w-full md:min-w-52 md:w-52 p-4 md:p-6 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-gray-300 shadow-md min-h-[60px] md:min-h-screen h-full bg-white z-10">
                    <nav className="flex-1 flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-4">
                        <button className="w-full rounded-lg px-4 py-3 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base md:text-lg flex items-center">
                            <PackageOpen className="w-5 h-5 inline-block mr-2" />
                            <span className="hidden sm:inline">Estoque</span>
                        </button>
                        <button className="w-full rounded-lg px-4 py-3 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base md:text-lg flex items-center">
                            <User className="w-5 h-5 inline-block mr-2" />
                            <span className="hidden sm:inline">Perfil</span>
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 p-2 md:p-6 w-full">
                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center md:text-left">
                            Estoque geral de remédios
                        </h1>

                        {/* Search and Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4 md:mb-6">
                            <div className="w-full md:flex-1 md:max-w-2xl relative">
                                <SearchBar
                                    value={tabelaBusca}
                                    onChange={setTabelaBusca}
                                    placeholder="Buscar por nome, lote ou categoria..."
                                />
                                {/* <input
                                    type="text"
                                    placeholder="Buscar remédio..."
                                    // value={tabelaBuscaQuery}
                                    // onChange={(e) =>
                                    //     // setTabelaBuscaQuery(e.target.value)
                                    // }
                                    className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
                            </div>

                            <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
                                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                                    {/* <Filter className="w-6 h-6 text-gray-700" /> */}
                                </button>
                                <button className="bg-sky-500 text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-sky-600 transition-colors text-sm md:text-base">
                                    Cadastrar categoria
                                </button>
                                <button
                                    className="bg-black text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm md:text-base"
                                    //onClick={handleOpenCreateModal}
                                >
                                    Adicionar remédio
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <MedicamentosTable searchTerm={debaunceBusca} />
                        </div>
                    </div>
                </main>
            </div>

            {/* {isModalOpen && (
                <MedicationFormModal
                    medicationData={editingMed}
                    onClose={handleCloseModal}
                />
            )} */}
        </div>
    );
};
