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
    <div class="relative overflow-hidden space-y-16 md:space-y-24">
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="flex flex-col items-start z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-light-green/80 dark:bg-brand-green/20 text-brand-green dark:text-emerald-300 border border-brand-green/20 dark:border-emerald-500/30 backdrop-blur-md mb-6">
            <span class="w-2 h-2 rounded-full bg-brand-green dark:bg-emerald-400 animate-pulse"></span>
            <span>Plataforma Digital de Preservación Cultural</span>
          </div>

          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-zinc-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Aprende Wayuunaiki, <br/>
            <span class="text-brand-green dark:text-emerald-400">Vive la Cultura</span>
          </h1>

          <p class="text-base md:text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg leading-relaxed">
            Inicia tu camino en la lengua ancestral del pueblo Wayuu. Con tu cuenta gratuita accede a cursos interactivos, evaluaciones dinámicas tipo quiz, práctica de pronunciación con audio nativo y seguimiento de racha con puntos de experiencia.
          </p>

          <div class="flex flex-wrap items-center gap-4 w-full">
            @if (tokenService.isAuthenticated()) {
              <a 
                routerLink="/dashboard" 
                class="bg-brand-green hover:bg-emerald-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-brand-green/25 hover:shadow-brand-green/40 hover:-translate-y-0.5 flex items-center gap-2.5">
                <span>Ir a mi Dashboard</span>
                <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
              </a>
              <a 
                routerLink="/cursos" 
                class="glass-panel px-8 py-3.5 rounded-2xl font-bold text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-emerald-400 hover:border-brand-green/40 transition-all shadow-sm hover:-translate-y-0.5 flex items-center gap-2">
                <lucide-icon name="graduation-cap" class="w-4 h-4"></lucide-icon>
                <span>Mis Cursos</span>
              </a>
            } @else {
              <button 
                type="button"
                (click)="ui.openRegisterModal()" 
                class="bg-brand-orange hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:-translate-y-0.5 flex items-center gap-2.5">
                <span>Crear Cuenta Gratuita</span>
                <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
              </button>
              <a 
                routerLink="/diccionario" 
                class="glass-panel px-8 py-3.5 rounded-2xl font-bold text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-emerald-400 hover:border-brand-green/40 transition-all shadow-sm hover:-translate-y-0.5 flex items-center gap-2">
                <lucide-icon name="book-open" class="w-4 h-4"></lucide-icon>
                <span>Explorar Diccionario</span>
              </a>
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

      <!-- Beneficios de Registrarte -->
      <section class="py-8 relative">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          <div class="text-center max-w-2xl mx-auto mb-14">
            <span class="text-xs font-bold uppercase tracking-wider text-brand-green dark:text-emerald-400 mb-2 block">
              Ventajas de la Plataforma
            </span>
            <h2 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-4">
              ¿Por qué aprender en Yonna Akademia?
            </h2>
            <p class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base">
              Una experiencia educativa estructurada para que desarrolles fluidez lingüística y comprensión cultural profunda.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Benefit 1 -->
            <div class="glass-card glass-card-hover p-7 rounded-3xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center mb-5">
                  <lucide-icon name="graduation-cap" class="w-6 h-6"></lucide-icon>
                </div>
                <h3 class="text-lg font-display font-bold text-zinc-900 dark:text-white mb-2">
                  Cursos Progresivos
                </h3>
                <p class="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Lecciones modulares que avanzan desde conceptos básicos hasta estructuras oracionales complejas y sabiduría tradicional.
                </p>
              </div>
              <div class="mt-5 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-semibold text-brand-green dark:text-emerald-400">
                Acceso exclusivo para usuarios registrados
              </div>
            </div>

            <!-- Benefit 2 -->
            <div class="glass-card glass-card-hover p-7 rounded-3xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange flex items-center justify-center mb-5">
                  <lucide-icon name="award" class="w-6 h-6"></lucide-icon>
                </div>
                <h3 class="text-lg font-display font-bold text-zinc-900 dark:text-white mb-2">
                  Quizzes Culturales
                </h3>
                <p class="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Evaluaciones interactivas diseñadas por sabedores Wayuu para medir y afianzar tus conocimientos en tiempo real.
                </p>
              </div>
              <div class="mt-5 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-semibold text-brand-orange">
                Retroalimentación inmediata y explicativa
              </div>
            </div>

            <!-- Benefit 3 -->
            <div class="glass-card glass-card-hover p-7 rounded-3xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mb-5">
                  <lucide-icon name="flame" class="w-6 h-6"></lucide-icon>
                </div>
                <h3 class="text-lg font-display font-bold text-zinc-900 dark:text-white mb-2">
                  Racha y Puntos XP
                </h3>
                <p class="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Sistema de niveles y racha diaria que premia tu constancia y te impulsa en la tabla de clasificación comunitaria.
                </p>
              </div>
              <div class="mt-5 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-semibold text-amber-500">
                Suma experiencia en cada sesión
              </div>
            </div>

            <!-- Benefit 4 -->
            <div class="glass-card glass-card-hover p-7 rounded-3xl flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center mb-5">
                  <lucide-icon name="volume-2" class="w-6 h-6"></lucide-icon>
                </div>
                <h3 class="text-lg font-display font-bold text-zinc-900 dark:text-white mb-2">
                  Pronunciación Nativa
                </h3>
                <p class="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Grabaciones de audio auténticas para perfeccionar el acento y la entonación exacta de cada vocablo y frase.
                </p>
              </div>
              <div class="mt-5 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-semibold text-brand-green dark:text-emerald-400">
                Diccionario fonético integrado
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Vocabulario Destacado -->
      <section class="py-8 relative">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          <div class="text-center max-w-xl mx-auto mb-12">
            <span class="text-xs font-bold uppercase tracking-wider text-brand-green dark:text-emerald-400 mb-2 block">
              Léxico Esencial
            </span>
            <h2 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-3">
              Vocabulario Destacado
            </h2>
            <p class="text-zinc-600 dark:text-zinc-400 text-sm">
              Primeras palabras para iniciar tu inmersión lingüística en Wayuunaiki
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
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
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mañana / Lejano</p>
            </div>

            <div class="glass-card glass-card-hover p-6 rounded-2xl text-center">
              <span class="text-2xl md:text-3xl font-display font-bold text-brand-green dark:text-emerald-400 block mb-1.5">Jieyuu</span>
              <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">Wayuunaiki</span>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mujeres</p>
            </div>
          </div>

          <div class="text-center">
            <a routerLink="/diccionario" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-green dark:text-emerald-400 hover:underline">
              <span>Ver todas las categorías en el Diccionario</span>
              <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
            </a>
          </div>
        </div>
      </section>

      <!-- Bottom Call To Action for Guests -->
      @if (!tokenService.isAuthenticated()) {
        <section class="max-w-7xl mx-auto px-4 md:px-8 pb-8">
          <div class="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-brand-green/30">
            <div class="max-w-xl z-10">
              <h3 class="text-2xl md:text-3xl font-display font-extrabold text-zinc-900 dark:text-white mb-3">
                ¿Listo para comenzar tu aprendizaje?
              </h3>
              <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Crea tu cuenta en menos de un minuto. Podrás guardar tu progreso, practicar lecciones interactivas y participar en la preservación de la lengua Wayuu.
              </p>
            </div>

            <div class="flex items-center gap-4 z-10 flex-shrink-0">
              <button 
                type="button"
                (click)="ui.openRegisterModal()" 
                class="bg-brand-green hover:bg-emerald-800 text-white px-7 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-green/25 hover:shadow-brand-green/40 flex items-center gap-2 text-sm">
                <span>Registrarme Ahora</span>
                <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
              </button>
              <button 
                type="button"
                (click)="ui.openLoginModal()" 
                class="glass-panel px-6 py-3 rounded-2xl font-semibold text-zinc-800 dark:text-zinc-200 hover:text-brand-green text-sm">
                Iniciar Sesión
              </button>
            </div>

            <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-green/10 blur-3xl -z-0"></div>
          </div>
        </section>
      }
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
