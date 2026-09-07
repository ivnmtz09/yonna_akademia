import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiService } from '../../core/services/ui.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  template: `
    <div class="relative overflow-hidden">
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="flex flex-col items-start z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-light-green/80 dark:bg-brand-green/20 text-brand-green dark:text-emerald-300 border border-brand-green/20 dark:border-emerald-500/30 backdrop-blur-md mb-6">
            <span class="w-2 h-2 rounded-full bg-brand-green dark:bg-emerald-400 animate-pulse"></span>
            <span>Archivo Digital Cultural</span>
          </div>

          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-zinc-900 dark:text-white leading-[1.08] tracking-tight mb-6">
            Memoria Viva <br/> 
            <span class="text-brand-green dark:text-emerald-400">Wayuu</span>
          </h1>

          <p class="text-base md:text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg leading-relaxed">
            Explora nuestra colección interactiva: cursos de Wayuunaiki, vocabulario cultural, documentales y sabiduría viva preservada para el futuro.
          </p>

          <div class="flex flex-wrap items-center gap-4 w-full">
            @if (tokenService.isAuthenticated()) {
              <button 
                type="button"
                routerLink="/dashboard" 
                class="bg-brand-green hover:bg-emerald-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-brand-green/25 hover:shadow-brand-green/40 hover:-translate-y-0.5 flex items-center gap-2.5">
                <span>Continuar Aprendiendo</span>
                <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
              </button>
            } @else {
              <button 
                type="button"
                (click)="ui.openRegisterModal()" 
                class="bg-brand-orange hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:-translate-y-0.5 flex items-center gap-2.5">
                <span>Crear Cuenta</span>
                <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
              </button>
              <button 
                type="button"
                (click)="ui.openLoginModal()" 
                class="glass-panel px-8 py-3.5 rounded-2xl font-bold text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-emerald-400 hover:border-brand-green/40 transition-all shadow-sm hover:-translate-y-0.5">
                Ingresar
              </button>
            }
          </div>
        </div>

        <div class="flex justify-center relative">
           <div class="absolute inset-0 bg-gradient-to-tr from-brand-green/20 via-brand-orange/15 to-transparent dark:from-brand-green/25 dark:via-brand-orange/15 rounded-full blur-3xl scale-95 pointer-events-none"></div>
           <div class="relative w-full max-w-[420px] aspect-square flex items-center justify-center z-10 animate-bounce-slow">
              <img src="assets/mascot/saludo.png" alt="Mascota Yonna" class="w-full max-w-[320px] h-auto object-contain drop-shadow-2xl">
           </div>
        </div>
      </section>

      <!-- Metodología de Aprendizaje -->
      <section class="py-20 relative">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          <div class="text-center max-w-2xl mx-auto mb-14">
            <h2 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-4">
              Metodología de Aprendizaje
            </h2>
            <p class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base">
              Una plataforma diseñada con rigor lingüístico, tecnología moderna y respeto por las tradiciones ancestrales.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div class="glass-card glass-card-hover p-8 rounded-3xl flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-2xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center mb-6">
                <lucide-icon name="book-open" class="w-7 h-7"></lucide-icon>
              </div>
              <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-3">
                Aprendizaje Inmersivo
              </h3>
              <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Sumérgete en la cultura Wayuu con lecciones prácticas, audio nativo y contenido multimedia interactivo.
              </p>
            </div>

            <div class="glass-card glass-card-hover p-8 rounded-3xl flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange flex items-center justify-center mb-6">
                <lucide-icon name="trophy" class="w-7 h-7"></lucide-icon>
              </div>
              <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-3">
                Gamificación
              </h3>
              <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Gana puntos de experiencia (XP), supera módulos diarios y desbloquea insignias de dominio de nivel.
              </p>
            </div>

            <div class="glass-card glass-card-hover p-8 rounded-3xl flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-2xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center mb-6">
                <lucide-icon name="users" class="w-7 h-7"></lucide-icon>
              </div>
              <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-3">
                Comunidad Activa
              </h3>
              <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Aprende junto a otros estudiantes, comparte progresos y fomenta la preservación lingüística en comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Vocabulario Destacado -->
      <section class="py-20 relative">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          <div class="text-center max-w-xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-3">
              Vocabulario Destacado
            </h2>
            <p class="text-zinc-600 dark:text-zinc-400 text-sm">
              Primeras palabras para iniciar tu viaje lingüístico
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div class="glass-card glass-card-hover p-6 rounded-2xl text-center">
              <span class="text-2xl md:text-3xl font-display font-bold text-brand-green dark:text-emerald-400 block mb-1.5">Kasa</span>
              <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Wayuunaiki</span>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Casa / Hogar</p>
            </div>

            <div class="glass-card glass-card-hover p-6 rounded-2xl text-center">
              <span class="text-2xl md:text-3xl font-display font-bold text-brand-green dark:text-emerald-400 block mb-1.5">A'ipia</span>
              <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Wayuunaiki</span>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Comer / Alimento</p>
            </div>

            <div class="glass-card glass-card-hover p-6 rounded-2xl text-center">
              <span class="text-2xl md:text-3xl font-display font-bold text-brand-green dark:text-emerald-400 block mb-1.5">Watta</span>
              <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Wayuunaiki</span>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Agua / Mañana</p>
            </div>

            <div class="glass-card glass-card-hover p-6 rounded-2xl text-center">
              <span class="text-2xl md:text-3xl font-display font-bold text-brand-green dark:text-emerald-400 block mb-1.5">Jieyuu</span>
              <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Wayuunaiki</span>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mujeres</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .animate-bounce-slow { animation: bounce-slow 3.5s infinite ease-in-out; }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(-2%); }
      50% { transform: translateY(2%); }
    }
  `]
})
export class Home {
  ui = inject(UiService);
  tokenService = inject(TokenService);
}
