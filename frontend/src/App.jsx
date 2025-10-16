import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import "./index.css";
import "./App.css";
import "./styles/components.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onLoginClick={openLogin}
                    onRegisterClick={openRegister}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Modales de Login y Registro */}
          {showLogin && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                <button
                  onClick={closeModals}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <Login
                  onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                />
              </div>
            </div>
          )}

          {showRegister && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                <button
                  onClick={closeModals}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <Register
                  onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                />
              </div>
            </div>
          )}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
