import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import MovieDashboard from "./pages/MovieDashboard";

function ProtectedDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage onLoginSuccess={() => undefined} />;
  }

  return <MovieDashboard />;
}

function AppShell() {
  return <ProtectedDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
