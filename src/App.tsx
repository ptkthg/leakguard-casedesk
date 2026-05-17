import { useAppStore } from '@/store/useAppStore';
import { LoginPage } from '@/pages/Login/LoginPage';
import { AppShell } from '@/components/layout/AppShell';

function App() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return isAuthenticated ? <AppShell /> : <LoginPage />;
}

export default App;
