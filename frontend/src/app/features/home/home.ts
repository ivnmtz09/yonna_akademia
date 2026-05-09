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
    <main>
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="flex flex-col items-start">
          <div class="inline-flex items-center gap-2 bg-brand-light-green text-brand-green px-4 py-1.5 rounded-full text-sm font-bold mb-8">
            <span class="w-2 h-2 rounded-full bg-brand-green"></span> Archivo Digital Cultural
          </div>
          <h1 class="text-6xl md:text-7xl font-extrabold text-[#0B1B28] dark:text-white leading-[1.1] tracking-tight mb-6">
            Memoria Viva <br/> 
            <span class="text-brand-green">Wayuu</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-md leading-relaxed">
            Explora nuestra colección multimedia. Documentales, fotografías y escritos que preservan la esencia y sabiduría de nuestro pueblo.
          </p>
          <div class="flex items-center gap-4 w-full">
            @if (tokenService.isAuthenticated()) {
              <button routerLink="/dashboard" class="bg-brand-green text-white px-8 py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-green-500/30 flex items-center gap-2">
                Continuar Aprendiendo <lucide-icon name="arrow-right" class="w-5 h-5"></lucide-icon>
              </button>
            } @else {
              <button (click)="ui.openRegisterModal()" class="bg-brand-orange text-white px-8 py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2">
                Crear Cuenta <lucide-icon name="arrow-right" class="w-5 h-5"></lucide-icon>
              </button>
              <button (click)="ui.openLoginModal()" 
                class="bg-gray-400 border-2 border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 px-8 py-3.5 rounded-xl font-bold hover:border-brand-orange hover:bg-orange-200 dark:hover:bg-orange-300 dark:hover:border-brand-orange transition-all shadow-sm">
                Ingresar
              </button>
            }
          </div>
        </div>
        <div class="flex justify-center relative">
           <div class="absolute inset-0 bg-brand-light-green dark:bg-brand-green/20 rounded-full blur-3xl opacity-50 scale-90"></div>
           <div class="relative w-[450px] h-[450px] flex items-center justify-center z-10 animate-bounce-slow">
              <img src="assets/mascot/saludo.png" alt="Mascota" class="w-full max-w-[300px] h-auto object-contain z-10">
           </div>
        </div>
      </section>

      <!-- Metodología de Aprendizaje -->
      <section class="py-20 bg-gray-50 dark:bg-slate-900">
        <div class="max-w-7xl mx-auto px-8">
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">Metodología de Aprendizaje</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center">
              <lucide-icon name="book-open" class="w-12 h-12 text-brand-green mb-6"></lucide-icon>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Aprendizaje Inmersivo</h3>
              <p class="text-gray-600 dark:text-gray-300">Sumérgete en la cultura Wayuu con contenido multimedia interactivo.</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center">
              <lucide-icon name="trophy" class="w-12 h-12 text-brand-orange mb-6"></lucide-icon>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Gamificación</h3>
              <p class="text-gray-600 dark:text-gray-300">Gana XP, sube de nivel y desbloquea logros mientras aprendes.</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center">
              <lucide-icon name="users" class="w-12 h-12 text-brand-green mb-6"></lucide-icon>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Comunidad</h3>
              <p class="text-gray-600 dark:text-gray-300">Conéctate con otros estudiantes y comparte tu progreso.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Vocabulario Destacado -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-8">
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">Vocabulario Destacado</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <p class="text-2xl font-bold text-brand-green mb-2">Kasa</p>
              <p class="text-gray-600 dark:text-gray-300">Casa</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <p class="text-2xl font-bold text-brand-green mb-2">A'ipia</p>
              <p class="text-gray-600 dark:text-gray-300">Comer</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <p class="text-2xl font-bold text-brand-green mb-2">Watta</p>
              <p class="text-gray-600 dark:text-gray-300">Agua</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <p class="text-2xl font-bold text-brand-green mb-2">Jieyuu</p>
              <p class="text-gray-600 dark:text-gray-300">Hola</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 py-12">
        <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-8 h-8 object-contain">
              <span class="text-xl font-bold text-gray-900 dark:text-white">Yonna Akademia</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm">Preservando la cultura Wayuu a través del aprendizaje digital.</p>
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Enlaces</h4>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-gray-600 dark:text-gray-300 hover:text-brand-green text-sm">Inicio</a></li>
              <li><a routerLink="/cultura" class="text-gray-600 dark:text-gray-300 hover:text-brand-green text-sm">Cultura Wayuu</a></li>
              <li><a routerLink="/dashboard" class="text-gray-600 dark:text-gray-300 hover:text-brand-green text-sm">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 dark:text-gray-300 hover:text-brand-green text-sm">Términos y Condiciones</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-300 hover:text-brand-green text-sm">Política de Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Redes Sociales</h4>
            <div class="flex gap-4">
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-brand-green"><lucide-icon name="facebook" class="w-6 h-6"></lucide-icon></a>
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-brand-green"><lucide-icon name="twitter" class="w-6 h-6"></lucide-icon></a>
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-brand-green"><lucide-icon name="instagram" class="w-6 h-6"></lucide-icon></a>
            </div>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-8 mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2026 Yonna Akademia. Todos los derechos reservados.
        </div>
      </footer>
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
export class Home {
  ui = inject(UiService);
  tokenService = inject(TokenService);
}
