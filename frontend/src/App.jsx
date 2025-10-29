import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useState } from 'react';
import Topbar from './components/common/Topbar';
import Sidebar from './components/common/Sidebar';
import HomePage from './pages/HomePage';
import ProfilePage from './components/profile/ProfilePage';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Topbar />
          <Sidebar
            onOpenLogin={() => setShowLogin(true)}
            onOpenRegister={() => setShowRegister(true)}
          />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/cursos" element={<div className="pt-20 pl-64 p-8">Cursos - En construcción</div>} />
            <Route path="/quizzes" element={<div className="pt-20 pl-64 p-8">Quizzes - En construcción</div>} />
          </Routes>

          <LoginModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={handleSwitchToRegister}
          />

          <RegisterModal
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={handleSwitchToLogin}
          />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#00b894',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ff4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;