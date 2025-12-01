import { Search, Bell } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { NotificationPopup } from "../NotificationPopup";

export const Navbar = () => {
  const [buscaQuery, setBuscaQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { isCollapsed } = useSidebar();
  const { unreadCount } = useNotifications();

  return (
    <header className="bg-sky-500 px-10 py-2 flex items-center justify-between">
      {/* Logo */}
      <div className={`absolute left-0 flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-48'}`}>
        <img 
          src="/casaDoAmorLogo.png" 
          alt="Logo Casa do Amor" 
          className="h-auto w-12"
        />
      </div>

      <div className={`flex-1 max-w-xl transition-all duration-300 ${isCollapsed ? 'ml-8' : 'ml-46'}`}>
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
      <div className="flex items-center gap-4">
        {/* Sino de notificações */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-sky-600 rounded-lg transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-sky-500" />
            )}
          </button>
          
          {showNotifications && (
            <NotificationPopup onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <div className="text-right">
          <p className="text-white font-medium text-sm">Casa do Amor</p>
          <p className="text-sky-100 text-xs">Administrador</p>
        </div>
        <div className="w-14 h-14 flex items-center justify-center border-white rounded-full bg-white hover:bg-sky-50 transition-colors cursor-pointer">
          <img
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=CasaDoAmor"
            alt="User"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
