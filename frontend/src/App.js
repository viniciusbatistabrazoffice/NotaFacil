import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/notas-fiscais"
              element={<ComingSoonPage title="Notas Fiscais" />}
            />
            <Route
              path="/clientes"
              element={<ComingSoonPage title="Clientes" />}
            />
            <Route
              path="/produtos"
              element={<ComingSoonPage title="Produtos" />}
            />
            <Route
              path="/relatorios"
              element={<ComingSoonPage title="Relatórios" />}
            />
            <Route
              path="/configuracoes"
              element={<ComingSoonPage title="Configurações" />}
            />
            <Route path="/ajuda" element={<ComingSoonPage title="Ajuda" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
