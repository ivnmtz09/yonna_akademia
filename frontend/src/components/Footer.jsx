export default function Footer() {
  return (
    <footer className="bg-[#FFFAF3] border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-gray-700">
        <div>
          <h3 className="text-lg font-bold text-[#FF8025] mb-2">Yonna Akademia</h3>
          <p className="text-sm leading-relaxed">
            Educación viva, ancestral y digital.  
            Conectando el saber Wayuu con el futuro.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Explora</h4>
          <ul className="text-sm space-y-1">
            <li><a href="/" className="hover:text-[#FF8025]">Inicio</a></li>
            <li><a href="/profile" className="hover:text-[#FF8025]">Perfil</a></li>
            <li><a href="#" className="hover:text-[#FF8025]">Cursos</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Contacto</h4>
          <ul className="text-sm space-y-1">
            <li>Email: contacto@yonna.tech</li>
            <li>Instagram: <a href="#" className="hover:text-[#FF8025]">@yonna.tech</a></li>
            <li>© {new Date().getFullYear()} Todos los derechos reservados.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
