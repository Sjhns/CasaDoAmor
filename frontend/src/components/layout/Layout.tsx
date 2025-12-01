import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "../../contexts/SidebarContext";
import { NotificationProvider } from "../../contexts/NotificationContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="min-h-screen">
          <Navbar />
          <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  );
};
