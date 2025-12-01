import { PackageOpen, User, History, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-16' : 'w-53'
      } ${
        isCollapsed ? 'px-2' : 'p-4'
      } py-4 flex flex-col border-r border-gray-300 shadow-md sticky top-0 h-screen overflow-auto transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-700 flex-shrink-0" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-700 flex-shrink-0" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-3">
        <button 
          onClick={() => navigate('/')}
          className={`w-full rounded-lg ${
            isCollapsed ? 'px-0 py-2.5 flex justify-center items-center' : 'px-3 py-2.5 text-left flex items-center'
          } font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base`}
          title={isCollapsed ? "Estoque" : undefined}
        >
          <PackageOpen className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-2">Estoque</span>}
        </button>
        <button 
          onClick={() => navigate('/historico')}
          className={`w-full rounded-lg ${
            isCollapsed ? 'px-0 py-2.5 flex justify-center items-center' : 'px-3 py-2.5 text-left flex items-center'
          } font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base`}
          title={isCollapsed ? "Histórico" : undefined}
        >
          <History className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-2">Histórico</span>}
        </button>
        <button 
          className={`w-full rounded-lg ${
            isCollapsed ? 'px-0 py-2.5 flex justify-center items-center' : 'px-3 py-2.5 text-left flex items-center'
          } font-medium transition-colors cursor-pointer hover:bg-gray-200 text-base`}
          title={isCollapsed ? "Perfil" : undefined}
        >
          <User className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-2">Perfil</span>}
        </button>
      </nav>
    </aside>
  );
};
