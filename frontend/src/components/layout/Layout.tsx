import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-3">
          {children}
        </main>
      </div>
    </div>
  );
};
