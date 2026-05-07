import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    @if (ui.isMobileMenuOpen()) {
      <!-- Overlay oscuro -->
      <div 
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
        (click)="ui.closeMobileMenu()"
      ></div>

      <!-- Panel Lateral -->
      <div 
        class="fixed right-0 top-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col"
      >
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div class="flex items-center gap-2">
            <img src="assets/brand/yonna.png" alt="Logo" class="w-8 h-8 object-contain">
            <span class="text-lg font-bold text-gray-900 tracking-tight">Yonna</span>
          </div>
          <button (click)="ui.closeMobileMenu()" class="p-2 bg-white rounded-full text-gray-400 hover:text-gray-700 shadow-sm border border-gray-100 transition-colors">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="p-6 flex-1 flex flex-col gap-3 overflow-y-auto">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Navegación</p>
          <a routerLink="/" (click)="ui.closeMobileMenu()" class="flex items-center gap-3 px-4 py-3.5 bg-brand-light-green text-brand-green font-bold rounded-xl transition-all">
            <lucide-icon name="home" class="w-5 h-5"></lucide-icon> Inicio
          </a>
          <a routerLink="/cultura" (click)="ui.closeMobileMenu()" class="flex items-center gap-3 px-4 py-3.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all">
            <lucide-icon name="book-open" class="w-5 h-5"></lucide-icon> Cultura Wayuu
          </a>
        </div>

        <div class="p-6 border-t border-gray-100 flex flex-col gap-4 bg-white">
          <button (click)="ui.openLoginModal()" class="w-full text-gray-900 font-bold py-3.5 border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            Ingresar
          </button>
          <button (click)="ui.openRegisterModal()" class="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 shadow-lg hover:shadow-brand-green/20 transition-all">
            Crear Cuenta
          </button>
        </div>
      </div>
    }
  `
})
export class MobileMenuComponent {
  ui = inject(UiService);
}
