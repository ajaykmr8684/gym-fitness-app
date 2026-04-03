import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Billing } from './pages/Billing';
import { Reminders } from './pages/Reminders';
import { Login } from './pages/Login';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

const ProtectedLayout = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-6 lg:px-4 lg:py-8">
          <Outlet />
        </main>
      </div>
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reminders" element={<Reminders />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
