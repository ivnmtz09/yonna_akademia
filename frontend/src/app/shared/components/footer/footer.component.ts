import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <footer class="bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl border-t border-zinc-200/60 dark:border-zinc-800/80 py-12 mt-12 transition-colors">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 items-start">
          <!-- Columna 1: Marca y Propósito -->
          <div class="flex flex-col gap-3.5 sm:col-span-2 md:col-span-1">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-green/20 to-brand-orange/20 dark:from-brand-green/30 dark:to-brand-orange/30 p-1 flex items-center justify-center">
                <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-full h-full object-contain">
              </div>
              <span class="text-xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                Yonna <span class="text-brand-green dark:text-emerald-400 font-normal">Akademia</span>
              </span>
            </div>
            <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
              Preservando y revitalizando la lengua y cultura Wayuu a través de tecnología interactiva y educación digital inclusiva.
            </p>
          </div>

          <!-- Columna 2: Plataforma -->
          <div>
            <h4 class="text-xs font-display font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
              Plataforma
            </h4>
            <ul class="space-y-2.5">
              <li>
                <a routerLink="/" class="text-zinc-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2">
                  <span>Inicio</span>
                </a>
              </li>
              <li>
                <a routerLink="/diccionario" class="text-zinc-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2">
                  <span>Diccionario Wayuu</span>
                </a>
              </li>
              <li>
                <a routerLink="/cursos" class="text-zinc-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2">
                  <span>Cursos Disponibles</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Columna 3: Información Legal -->
          <div>
            <h4 class="text-xs font-display font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
              Información
            </h4>
            <ul class="space-y-2.5">
              <li>
                <a routerLink="/terminos-condiciones" class="text-zinc-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2">
                  <span>Términos y Condiciones</span>
                </a>
              </li>
              <li>
                <a routerLink="/politica-privacidad" class="text-zinc-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2">
                  <span>Política de Privacidad</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright inferior -->
        <div class="mt-10 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-zinc-400 dark:text-zinc-500 text-xs">
          <p>© 2026 Yonna Akademia. Todos los derechos reservados.</p>
          <p>Hecho con respeto por la memoria viva Wayuu</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
