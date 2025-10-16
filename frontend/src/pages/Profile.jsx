import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="max-w-lg mx-auto mt-12 bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-[#FF8025] mb-4 text-center">
        Perfil de usuario
      </h2>
      {user ? (
        <div className="space-y-2 text-gray-700">
          <p><strong>Nombre:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <p><strong>Nivel:</strong> {user.level}</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Cargando...</p>
      )}
    </section>
  );
}
