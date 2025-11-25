import { Dashboard } from "./pages/Dashboard";
import HistoricoPage from './pages/HistoricoPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/historico" element={<HistoricoPage />} />
      </Routes>
    </BrowserRouter>
  );
};
