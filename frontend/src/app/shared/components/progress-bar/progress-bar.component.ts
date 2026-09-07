import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationProgressService } from '../../../core/services/navigation-progress.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Barra de progreso fija en el borde superior de la pantalla -->
    <div
      class="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none transition-opacity duration-300 overflow-hidden bg-transparent"
      [class.opacity-100]="navService.isLoading() || navService.progress() > 0"
      [class.opacity-0]="!navService.isLoading() && navService.progress() === 0">
      <div
        class="h-full bg-gradient-to-r from-brand-green via-emerald-400 to-brand-orange shadow-[0_0_12px_rgba(45,90,76,0.6)] transition-all duration-300 ease-out"
        [style.width.%]="navService.progress()"></div>
    </div>

    <!-- Indicador flotante sutil con micro-spinner vectorial -->
    @if (navService.isLoading()) {
      <div class="fixed top-3.5 right-4 z-[99] pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel shadow-md border border-zinc-200/70 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 animate-fadeIn">
        <lucide-icon name="loader-circle" class="w-3.5 h-3.5 text-brand-green dark:text-emerald-400 animate-spin"></lucide-icon>
        <span class="text-[11px] font-medium tracking-wide">Cargando</span>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `]
})
export class ProgressBarComponent {
  navService = inject(NavigationProgressService);
}
