import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { AppProvider } from './context/AppContext';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Billing } from './pages/Billing';
import { Reminders } from './pages/Reminders';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reminders" element={<Reminders />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
