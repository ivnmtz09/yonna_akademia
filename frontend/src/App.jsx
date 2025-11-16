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
import ProfilePage from './components/profile/ProfilePage';

// Estilos
import './styles/index.css';

// Componente de rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" replace />;
}

// Componente de layout para páginas con header
const Layout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header />}
      <main className={user ? '' : ''}>
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
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
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
              
              {/* Rutas protegidas */}
              <Route 
                path="/courses" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cursos</h1>
                        <p className="text-gray-600">Página de cursos en desarrollo...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/quizzes" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quizzes</h1>
                        <p className="text-gray-600">Página de quizzes en desarrollo...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Progreso</h1>
                        <p className="text-gray-600">Página de progreso en desarrollo...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/achievements" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Logros</h1>
                        <p className="text-gray-600">Página de logros en desarrollo...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
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
              
              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;