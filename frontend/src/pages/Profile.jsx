import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No hay token, inicia sesión");

        const response = await fetch("http://127.0.0.1:8000/api/auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("No se pudo obtener el usuario");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-amber-700">Mi Perfil</h2>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email || "No registrado"}</p>
      <p><strong>Rol:</strong> {user.role}</p>
    </div>
  );
}
