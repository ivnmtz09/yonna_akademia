import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [modalType, setModalType] = useState(null); // 'login' | 'register' | null
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#FF8025] select-none cursor-default">
        Yonna Akademia
      </h1>

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">{user?.first_name}</span>
          <button
            onClick={logout}
            className="bg-[#FF8025] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e56c14] transition"
          >
            Salir
          </button>
        </div>
      ) : (
        <button
          onClick={() => setModalType("login")}
          className="bg-[#60AB90] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#4b917a] transition"
        >
          Accede / Regístrate
        </button>
      )}

      {modalType === "login" && (
        <LoginModal onClose={() => setModalType(null)} onSwitch={setModalType} />
      )}
      {modalType === "register" && (
        <RegisterModal onClose={() => setModalType(null)} onSwitch={setModalType} />
      )}
    </header>
  );
}
