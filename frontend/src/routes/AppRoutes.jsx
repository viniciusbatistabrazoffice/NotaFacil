import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import NotasPage from '../pages/notas/NotasPage';
import PedidosPage from '../pages/pedidos/PedidosPage';
import ProdutosPage from '../pages/produtos/ProdutosPage';
import ProducaoPage from '../pages/producao/ProducaoPage';
import EstoquePage from '../pages/estoque/EstoquePage';
import ClientesPage from '../pages/clientes/ClientesPage';
import RelatoriosPage from '../pages/relatorios/RelatoriosPage';
import ConfiguracoesPage from '../pages/configuracoes/ConfiguracoesPage';
import EmitirNotaPage from '../pages/emitir/EmitirNotaPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/notas" element={<NotasPage />} />
          <Route path="/emitir" element={<EmitirNotaPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/producao" element={<ProducaoPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
