import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Companies from "./pages/Companies";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/painel" element={<Dashboard />} />
        <Route path="/empresas" element={<Companies />} />
        <Route path="/pedidos" element={<Navigate to="/painel" replace />} />
        <Route path="/lojas" element={<Navigate to="/painel" replace />} />
        <Route path="/usuarios" element={<Navigate to="/painel" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;