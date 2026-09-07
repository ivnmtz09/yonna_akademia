import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div class="glass-card max-w-xl w-full p-8 md:p-12 rounded-3xl text-center relative overflow-hidden shadow-2xl">
        <!-- Ambient decorative glow -->
        <div class="absolute -top-20 -right-20 w-48 h-48 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-green/15 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Mascot Image with gentle float animation -->
        <div class="relative w-full max-w-[240px] md:max-w-[280px] mx-auto aspect-square mb-6 flex items-center justify-center">
          <img 
            src="assets/mascot/error.png" 
            alt="Error 404 - Página no encontrada" 
            class="w-full h-full object-contain drop-shadow-xl animate-float"
            onerror="this.src='assets/mascot/saludo.png';"
          />
        </div>

        <!-- Error Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 mb-4">
          <lucide-icon name="circle-alert" class="w-3.5 h-3.5"></lucide-icon>
          <span>Error 404 · Ruta no encontrada</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
          Parece que te has apartado del camino
        </h1>

        <!-- Description -->
        <p class="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-md mx-auto">
          La página que intentas visitar no existe, fue renombrada o no se encuentra disponible. Puedes retomar tu ruta de aprendizaje desde aquí.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a 
            routerLink="/" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-800 text-white text-sm font-semibold px-6 py-3 rounded-2xl transition-all shadow-md shadow-brand-green/20 hover:-translate-y-0.5">
            <lucide-icon name="home" class="w-4 h-4"></lucide-icon>
            <span>Volver al Inicio</span>
          </a>

          <a 
            routerLink="/diccionario" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 glass-panel text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-emerald-400 text-sm font-semibold px-6 py-3 rounded-2xl transition-all hover:-translate-y-0.5">
            <lucide-icon name="book-open" class="w-4 h-4"></lucide-icon>
            <span>Consultar Diccionario</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
  `]
})
export class NotFoundComponent {}
