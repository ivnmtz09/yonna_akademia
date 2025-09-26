import { Link } from "react-router-dom";
import { LogIn, UserPlus, Home } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        Wayuu Platform
      </Link>
      <div className="flex gap-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-gray-700 hover:text-indigo-600"
        >
          <Home size={18} /> Home
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-1 text-gray-700 hover:text-indigo-600"
        >
          <LogIn size={18} /> Login
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-1 text-gray-700 hover:text-indigo-600"
        >
          <UserPlus size={18} /> Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
