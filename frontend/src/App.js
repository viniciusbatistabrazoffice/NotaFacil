import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { InvoiceDetailsPage } from './pages/InvoiceDetailsPage';
import { ProductionPage } from './pages/ProductionPage';
import { ClientsPage } from './pages/ClientsPage';
import { ProductsPage } from './pages/ProductsPage';
import { SuppliesPage } from './pages/SuppliesPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { SupportPage } from './pages/SupportPage';
import { UsersPage } from './pages/UsersPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { CashRegisterPage } from './pages/CashRegisterPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutProductsPage } from './pages/CheckoutProductsPage';
import { CheckoutPaymentPage } from './pages/CheckoutPaymentPage';
import { CheckoutSummaryPage } from './pages/CheckoutSummaryPage';
import { PDVPage } from './pages/PDVPage';
import { PDVProductsPage } from './pages/PDVProductsPage';
import { PDVPaymentPage } from './pages/PDVPaymentPage';
import { PDVSummaryPage } from './pages/PDVSummaryPage';
import { FinancialPage } from './pages/FinancialPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';
import './checkout.css';
import './checkout-dark.css';

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
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/pedidos/:id" element={<OrderDetailsPage />} />
            <Route path="/notas-fiscais" element={<InvoicesPage />} />
            <Route
              path="/notas-fiscais/:id"
              element={<InvoiceDetailsPage />}
            />
            <Route path="/producao" element={<ProductionPage />} />
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/insumos" element={<SuppliesPage />} />
            <Route path="/fornecedores" element={<SuppliersPage />} />
            <Route path="/caixa" element={<CashRegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage />}>
              <Route path="produtos" element={<CheckoutProductsPage />} />
              <Route path="pagamento" element={<CheckoutPaymentPage />} />
              <Route path="resumo" element={<CheckoutSummaryPage />} />
            </Route>
            <Route path="/pdv" element={<PDVPage />}>
              <Route index element={<PDVProductsPage />} />
              <Route path="produtos" element={<PDVProductsPage />} />
              <Route path="pagamento" element={<PDVPaymentPage />} />
              <Route path="resumo" element={<PDVSummaryPage />} />
            </Route>
            <Route path="/financeiro" element={<FinancialPage />} />
            <Route path="/relatorios" element={<ReportsPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route
              path="/perfil"
              element={<ComingSoonPage title="Meu Perfil" />}
            />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="/ajuda" element={<SupportPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
