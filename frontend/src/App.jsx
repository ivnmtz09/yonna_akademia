import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/common/Header';

// Pages
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import ContentDetailPage from './pages/ContentDetailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './components/profile/ProfilePage';

// Estilos
import './styles/index.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/feed" replace />;
  }
  
  return children;
}

// Layout simplificado: El Header siempre se muestra
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* pt-20 compensa la altura del Header fijo (h-20) */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#334155',
                  color: '#fff',
                },
                success: {
                  theme: {
                    primary: '#60AB90',
                    secondary: 'black',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Ruta pública - Home */}
              <Route 
                path="/" 
                element={
                  <Layout>
                    <HomePage />
                  </Layout>
                } 
              />
              
              {/* Feed Cultural - Pública */}
              <Route 
                path="/feed" 
                element={
                  <Layout>
                    <FeedPage />
                  </Layout>
                } 
              />
              
              {/* Detalle de contenido - Pública */}
              <Route 
                path="/content/:id" 
                element={
                  <Layout>
                    <ContentDetailPage />
                  </Layout>
                } 
              />
              
              {/* Dashboard Admin */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole={['admin', 'moderator']}>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Perfil */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;