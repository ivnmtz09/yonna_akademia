import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private readonly _isLoginModalOpen = signal(false);
  private readonly _isRegisterModalOpen = signal(false);
  private readonly _isSidebarOpen = signal(false);
  private readonly _isMobile = signal(this.checkMobile());
  private readonly _themeMode = signal<ThemeMode>(this.getInitialTheme());
  private readonly _isDarkMode = signal<boolean>(false);
  private readonly _isSidebarExpanded = signal(false);

  readonly isLoginModalOpen = this._isLoginModalOpen.asReadonly();
  readonly isRegisterModalOpen = this._isRegisterModalOpen.asReadonly();
  readonly isSidebarOpen = this._isSidebarOpen.asReadonly();
  readonly isMobile = this._isMobile.asReadonly();
  readonly themeMode = this._themeMode.asReadonly();
  readonly isDarkMode = this._isDarkMode.asReadonly();
  readonly isSidebarExpanded = this._isSidebarExpanded.asReadonly();

  private mediaQueryListener?: (e: MediaQueryListEvent) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.updateMobileStatus());

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryListener = () => {
        if (this._themeMode() === 'system') {
          this.applyTheme('system');
        }
      };
      mediaQuery.addEventListener('change', this.mediaQueryListener);

      effect(() => {
        const mode = this._themeMode();
        this.applyTheme(mode);
        try {
          localStorage.setItem('theme', mode);
        } catch {
          // ignore localStorage error
        }
      });
    }
  }

  private getInitialTheme(): ThemeMode {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      // Retrocompatibilidad con clave 'darkMode' anterior
      const legacyDarkMode = localStorage.getItem('darkMode');
      if (legacyDarkMode === 'true') return 'dark';
      if (legacyDarkMode === 'false') return 'light';
    }
    return 'system';
  }

  private applyTheme(mode: ThemeMode): void {
    if (typeof document === 'undefined') return;

    let shouldBeDark = false;
    if (mode === 'dark') {
      shouldBeDark = true;
    } else if (mode === 'light') {
      shouldBeDark = false;
    } else {
      // system
      if (typeof window !== 'undefined') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }

    this._isDarkMode.set(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(mode: ThemeMode): void {
    this._themeMode.set(mode);
  }

  toggleDarkMode(): void {
    const current = this._themeMode();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  // Sidebar management
  openSidebar() {
    this._isSidebarOpen.set(true);
    this._isLoginModalOpen.set(false);
    this._isRegisterModalOpen.set(false);
  }
  closeSidebar() {
    this._isSidebarOpen.set(false);
  }
  toggleSidebar() {
    this._isSidebarOpen.update(v => !v);
  }
  setSidebarExpanded(value: boolean) {
    this._isSidebarExpanded.set(value);
  }

  private checkMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }

  private updateMobileStatus(): void {
    this._isMobile.set(this.checkMobile());
  }

  // Modal de Inicio de Sesión
  openLoginModal() {
    this._isLoginModalOpen.set(true);
    this._isRegisterModalOpen.set(false);
    this._isSidebarOpen.set(false);
  }
  closeLoginModal() {
    this._isLoginModalOpen.set(false);
  }
  toggleLoginModal() {
    this._isLoginModalOpen.update(v => !v);
  }

  // Modal de Registro
  openRegisterModal() {
    this._isRegisterModalOpen.set(true);
    this._isLoginModalOpen.set(false);
    this._isSidebarOpen.set(false);
  }
  closeRegisterModal() {
    this._isRegisterModalOpen.set(false);
  }
  toggleRegisterModal() {
    this._isRegisterModalOpen.update(v => !v);
  }
}
