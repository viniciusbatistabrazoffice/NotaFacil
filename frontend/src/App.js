import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Splash from './components/ui/Splash';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Splash />
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
