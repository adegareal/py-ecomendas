import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Stores from "./pages/Stores";
import Users from "./pages/Users";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/painel" element={<Dashboard />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/lojas" element={<Stores />} />
        <Route path="/usuarios" element={<Users />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;