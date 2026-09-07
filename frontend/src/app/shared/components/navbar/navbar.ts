import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiService, ThemeMode } from '../../../core/services/ui.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="fixed top-0 left-0 w-full h-16 z-50 glass-nav flex items-center justify-between px-4 md:px-8">
      <!-- Brand Logo -->
      <div class="flex items-center gap-3 cursor-pointer group" routerLink="/">
        <div class="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-green/20 to-brand-orange/20 dark:from-brand-green/30 dark:to-brand-orange/30 p-1 transition-transform group-hover:scale-105">
          <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-full h-full object-contain">
        </div>
        <span class="text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
          Yonna <span class="text-brand-green dark:text-emerald-400 font-normal">Akademia</span>
        </span>
      </div>

      <!-- Navigation Links -->
      <div class="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/60 dark:bg-zinc-800/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/40">
        <a routerLink="/" 
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all"
           routerLinkActive="!text-brand-green !bg-white dark:!bg-zinc-900 shadow-sm font-semibold">
          <lucide-icon name="home" class="w-4 h-4"></lucide-icon>
          <span>Inicio</span>
        </a>
        <a routerLink="/diccionario" 
           class="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all"
           routerLinkActive="!text-brand-green !bg-white dark:!bg-zinc-900 shadow-sm font-semibold">
          <lucide-icon name="book-open" class="w-4 h-4"></lucide-icon>
          <span>Diccionario</span>
        </a>
        <a routerLink="/cursos" 
           class="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all"
           routerLinkActive="!text-brand-green !bg-white dark:!bg-zinc-900 shadow-sm font-semibold">
          <lucide-icon name="graduation-cap" class="w-4 h-4"></lucide-icon>
          <span>Cursos</span>
        </a>
      </div>

      <!-- Right Actions: Theme Selector & User Profile / Auth -->
      <div class="flex items-center gap-2 md:gap-3">
        <!-- Theme Mode Selector Dropdown -->
        <div class="relative theme-menu-container">
          <button 
            type="button"
            (click)="showThemeMenu.set(!showThemeMenu()); showProfileMenu.set(false)"
            aria-label="Cambiar tema visual"
            class="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-700/60 transition-all flex items-center justify-center">
            @if (ui.themeMode() === 'light') {
              <lucide-icon name="sun" class="w-4 h-4 text-amber-500"></lucide-icon>
            } @else if (ui.themeMode() === 'dark') {
              <lucide-icon name="moon" class="w-4 h-4 text-indigo-400"></lucide-icon>
            } @else {
              <lucide-icon name="monitor" class="w-4 h-4 text-brand-green dark:text-emerald-400"></lucide-icon>
            }
          </button>

          @if (showThemeMenu()) {
            <div class="absolute right-0 mt-2 w-44 glass-modal rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div class="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Tema de interfaz
              </div>
              <button 
                type="button"
                (click)="selectTheme('light')"
                class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                [class.font-semibold]="ui.themeMode() === 'light'"
                [class.text-brand-green]="ui.themeMode() === 'light'">
                <div class="flex items-center gap-2.5">
                  <lucide-icon name="sun" class="w-4 h-4 text-amber-500"></lucide-icon>
                  <span>Claro</span>
                </div>
                @if (ui.themeMode() === 'light') {
                  <lucide-icon name="check" class="w-4 h-4 text-brand-green"></lucide-icon>
                }
              </button>

              <button 
                type="button"
                (click)="selectTheme('dark')"
                class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                [class.font-semibold]="ui.themeMode() === 'dark'"
                [class.text-brand-green]="ui.themeMode() === 'dark'">
                <div class="flex items-center gap-2.5">
                  <lucide-icon name="moon" class="w-4 h-4 text-indigo-400"></lucide-icon>
                  <span>Oscuro</span>
                </div>
                @if (ui.themeMode() === 'dark') {
                  <lucide-icon name="check" class="w-4 h-4 text-brand-green"></lucide-icon>
                }
              </button>

              <button 
                type="button"
                (click)="selectTheme('system')"
                class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                [class.font-semibold]="ui.themeMode() === 'system'"
                [class.text-brand-green]="ui.themeMode() === 'system'">
                <div class="flex items-center gap-2.5">
                  <lucide-icon name="monitor" class="w-4 h-4 text-zinc-500 dark:text-zinc-400"></lucide-icon>
                  <span>Tema del sistema</span>
                </div>
                @if (ui.themeMode() === 'system') {
                  <lucide-icon name="check" class="w-4 h-4 text-brand-green"></lucide-icon>
                }
              </button>
            </div>
          }
        </div>

        <!-- Authenticated Profile / Guest Auth Buttons -->
        @if (tokenService.isAuthenticated()) {
          <div class="relative profile-menu-container">
            <button 
              type="button"
              (click)="showProfileMenu.set(!showProfileMenu()); showThemeMenu.set(false)" 
              class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-700/60 transition-all">
              <div class="flex flex-col items-end hidden sm:flex">
                <span class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Estudiante</span>
                <span class="text-[11px] text-zinc-500 dark:text-zinc-400">Nivel 1</span>
              </div>
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-green to-emerald-600 text-white flex items-center justify-center shadow-sm">
                <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
              </div>
              <lucide-icon name="chevron-down" class="w-3.5 h-3.5 text-zinc-400"></lucide-icon>
            </button>

            @if (showProfileMenu()) {
              <div class="absolute right-0 mt-2 w-52 glass-modal rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <a routerLink="/dashboard" 
                   (click)="showProfileMenu.set(false)"
                   class="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors">
                  <lucide-icon name="layout-dashboard" class="w-4 h-4 text-brand-green"></lucide-icon>
                  <span>Dashboard</span>
                </a>
                <a routerLink="/dashboard/perfil" 
                   (click)="showProfileMenu.set(false)"
                   class="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors">
                  <lucide-icon name="user" class="w-4 h-4 text-brand-green"></lucide-icon>
                  <span>Mi Perfil</span>
                </a>
                <div class="border-t border-zinc-200/60 dark:border-zinc-800 my-1"></div>
                <button 
                  type="button"
                  (click)="logout()" 
                  class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-left">
                  <lucide-icon name="log-out" class="w-4 h-4"></lucide-icon>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            }
          </div>
        } @else {
          <button 
            type="button"
            (click)="ui.openLoginModal()" 
            class="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60 rounded-xl transition-all">
            Ingresar
          </button>
          <button 
            type="button"
            (click)="ui.openRegisterModal()" 
            class="bg-brand-green hover:bg-opacity-90 text-white text-sm font-semibold px-4 md:px-5 py-2 rounded-xl transition-all shadow-md shadow-brand-green/20">
            Crear Cuenta
          </button>
        }

        <!-- Mobile Menu Toggle -->
        <button 
          type="button"
          (click)="ui.toggleSidebar()" 
          class="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <lucide-icon name="menu" class="w-5 h-5"></lucide-icon>
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

  showThemeMenu = signal(false);
  showProfileMenu = signal(false);

  selectTheme(mode: ThemeMode) {
    this.ui.setTheme(mode);
    this.showThemeMenu.set(false);
  }

  logout() {
    this.showProfileMenu.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-menu-container')) {
      this.showThemeMenu.set(false);
    }
    if (!target.closest('.profile-menu-container')) {
      this.showProfileMenu.set(false);
    }
  }
}
