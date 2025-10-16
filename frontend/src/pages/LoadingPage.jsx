export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <img
        src="/yonna.png"
        alt="Yonna Akademia Logo"
        className="w-32 h-32 animate-pulse"
      />
      <p className="text-[#60AB90] font-semibold mt-4 animate-bounce">
        Cargando la sabiduría...
      </p>
    </div>
  );
}
