import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiService } from '../../../core/services/ui.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <nav class="fixed top-0 left-0 w-full h-16 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 dark:bg-slate-900/95 dark:border-slate-800 flex items-center justify-between px-4 md:px-8">
      <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
        <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-8 h-8 object-contain">
        <span class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Yonna Akademia</span>
      </div>

      <div class="hidden md:flex items-center gap-2">
        <a routerLink="/" class="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-brand-green rounded-lg transition-all"
           routerLinkActive="text-brand-green bg-brand-light-green dark:bg-brand-green/20">
          <lucide-icon name="home" class="w-5 h-5"></lucide-icon> Inicio
        </a>
        <a routerLink="/diccionario" class="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-brand-green rounded-lg transition-all"
           routerLinkActive="text-brand-green bg-brand-light-green dark:bg-brand-green/20">
          <lucide-icon name="book-open" class="w-5 h-5"></lucide-icon> Diccionario
        </a>
        <a routerLink="/cursos" class="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-brand-green rounded-lg transition-all"
           routerLinkActive="text-brand-green bg-brand-light-green dark:bg-brand-green/20">
          <lucide-icon name="graduation-cap" class="w-5 h-5"></lucide-icon> Cursos
        </a>
      </div>

      <div class="flex items-center gap-3 md:gap-6">
        <button (click)="ui.toggleDarkMode()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          @if (ui.isDarkMode()) {
            <lucide-icon name="sun" class="w-5 h-5 text-gray-600 dark:text-gray-300"></lucide-icon>
          } @else {
            <lucide-icon name="moon" class="w-5 h-5 text-gray-600 dark:text-gray-300"></lucide-icon>
          }
        </button>

        @if (tokenService.isAuthenticated()) {
          <div class="relative profile-menu-container">
            <button (click)="showProfileMenu.set(!showProfileMenu())" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <div class="flex flex-col items-end">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">Nivel 5</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">1200 XP</span>
              </div>
              <div class="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <lucide-icon name="user" class="w-4 h-4 text-white"></lucide-icon>
              </div>
            </button>

            @if (showProfileMenu()) {
              <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-2 z-10">
                <a routerLink="/dashboard" class="flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <lucide-icon name="layout-dashboard" class="w-5 h-5"></lucide-icon>
                  Dashboard
                </a>
                <a routerLink="/dashboard/perfil" class="flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <lucide-icon name="user" class="w-5 h-5"></lucide-icon>
                  Mi Perfil
                </a>
                <div class="border-t border-gray-100 dark:border-slate-700 my-1"></div>
                <button (click)="logout()" class="w-full flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                  <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
                  Cerrar Sesión
                </button>
              </div>
            }
          </div>
        } @else {
          <button (click)="ui.openLoginModal()" class="text-gray-900 dark:text-white font-semibold hover:text-brand-green dark:hover:text-brand-green transition-colors text-sm md:text-base">Ingresar</button>
          <button (click)="ui.openRegisterModal()" class="bg-brand-green text-white font-semibold px-4 md:px-6 py-2 rounded-full hover:bg-opacity-90 transition-all shadow-md text-sm md:text-base">
            Crear Cuenta
          </button>
        }

        <button (click)="ui.toggleSidebar()" class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green transition-colors">
          <lucide-icon name="menu" class="w-6 h-6"></lucide-icon>
        </button>
      </div>
    </nav>
  `
})
export class Navbar {
  ui = inject(UiService);
  tokenService = inject(TokenService);
  authService = inject(AuthService);
  router = inject(Router);
  showProfileMenu = signal(false);

  logout() {
    this.showProfileMenu.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-container')) {
      this.showProfileMenu.set(false);
    }
  }
}
