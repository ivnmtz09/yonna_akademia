export default function Home({ onLoginClick, onRegisterClick }) {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
      <h2 className="text-4xl md:text-5xl font-bold text-[#FF8025] mb-4">
        Bienvenido a Yonna Akademia
      </h2>

      <p className="max-w-2xl text-gray-600 mb-8 leading-relaxed text-base md:text-lg">
        Una plataforma educativa que honra la cosmovisión Wayuu, integrando
        saberes tradicionales con herramientas tecnológicas modernas. Aprende de
        los sabedores y comparte tu conocimiento con el mundo.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onLoginClick}
          className="bg-[#60AB90] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4b917a] transition"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={onRegisterClick}
          className="bg-[#FF8025] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e56c14] transition"
        >
          Registrarse
        </button>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="font-bold text-lg text-[#60AB90] mb-2">Aprende</h3>
          <p className="text-gray-600 text-sm">
            Explora cursos diseñados por sabedores y docentes locales. Desde lengua
            Wayuunaiki hasta programación y liderazgo comunitario.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="font-bold text-lg text-[#60AB90] mb-2">Comparte</h3>
          <p className="text-gray-600 text-sm">
            Sube tus propios contenidos educativos y comparte tu sabiduría con
            estudiantes de toda La Guajira.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="font-bold text-lg text-[#60AB90] mb-2">Conecta</h3>
          <p className="text-gray-600 text-sm">
            Interactúa con mentores, aprende en tu idioma y crea redes de
            conocimiento sostenible.
          </p>
        </div>
      </div>
    </section>
  );
}
