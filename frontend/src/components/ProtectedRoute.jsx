import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "../pages/LoadingPage";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
}
