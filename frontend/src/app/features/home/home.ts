import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <main class="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="flex flex-col items-start">
        <div class="inline-flex items-center gap-2 bg-brand-light-green text-brand-green px-4 py-1.5 rounded-full text-sm font-bold mb-8">
          <span class="w-2 h-2 rounded-full bg-brand-green"></span> Archivo Digital Cultural
        </div>
        <h1 class="text-6xl md:text-7xl font-extrabold text-[#0B1B28] leading-[1.1] tracking-tight mb-6">
          Memoria Viva <br/> 
          <span class="text-brand-green">Wayuu</span>
        </h1>
        <p class="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
          Explora nuestra colección multimedia. Documentales, fotografías y escritos que preservan la esencia y sabiduría de nuestro pueblo.
        </p>
        <div class="flex items-center gap-4 w-full">
          <button class="bg-brand-orange text-white px-8 py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2">
            Crear Cuenta <span class="text-xl">→</span>
          </button>
          <button class="bg-white border-2 border-gray-100 text-gray-800 px-8 py-3.5 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
            Ingresar
          </button>
        </div>
      </div>
      <div class="flex justify-center relative">
         <div class="absolute inset-0 bg-brand-light-green rounded-full blur-3xl opacity-50 scale-90"></div>
         <div class="relative w-[450px] h-[450px] flex items-center justify-center text-[12rem] z-10 animate-bounce-slow">
            🐐
         </div>
      </div>
    </main>
  `,
  styles: [`
    .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(-3%); }
      50% { transform: translateY(3%); }
    }
  `]
})
export class Home {}
