import { PackageOpen, User, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-60 p-4 flex flex-col border-r border-gray-300 shadow-md sticky top-0 h-screen overflow-auto">
      <nav className="flex-1 space-y-3">
        <button 
          onClick={() => navigate('/')}
          className="w-full rounded-lg px-3 py-2.5 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base"
        >
          <PackageOpen className="w-4 h-4 inline-block mr-2" />
          Estoque
        </button>
        <button 
          onClick={() => navigate('/historico')}
          className="w-full rounded-lg px-3 py-2.5 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base"
        >
          <History className="w-4 h-4 inline-block mr-2" />
          Histórico
        </button>
        <button className="w-full rounded-lg px-3 py-2.5 text-left font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base">
          <User className="w-4 h-4 inline-block mr-2" />
          Perfil
        </button>
      </nav>
    </aside>
  );
};
