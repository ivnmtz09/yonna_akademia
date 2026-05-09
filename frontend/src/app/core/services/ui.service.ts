import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private readonly _isLoginModalOpen = signal(false);
  private readonly _isRegisterModalOpen = signal(false);
  private readonly _isSidebarOpen = signal(false); // Renamed from _isMobileMenuOpen
  private readonly _isMobile = signal(this.checkMobile());
  private readonly _isDarkMode = signal(this.getDarkModeFromLocalStorage());
  private readonly _isSidebarExpanded = signal(false); // New signal for sidebar expanded state

  readonly isLoginModalOpen = this._isLoginModalOpen.asReadonly();
  readonly isRegisterModalOpen = this._isRegisterModalOpen.asReadonly();
  readonly isSidebarOpen = this._isSidebarOpen.asReadonly(); // Renamed
  readonly isMobile = this._isMobile.asReadonly();
  readonly isDarkMode = this._isDarkMode.asReadonly();
  readonly isSidebarExpanded = this._isSidebarExpanded.asReadonly(); // Expose sidebar expanded state

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.updateMobileStatus());
      effect(() => {
        if (this._isDarkMode()) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', this._isDarkMode().toString());
      });
    }
  }

  private getDarkModeFromLocalStorage(): boolean {
    if (typeof localStorage !== 'undefined') {
      const storedValue = localStorage.getItem('darkMode');
      return storedValue === 'true';
    }
    return false;
  }

  toggleDarkMode() {
    this._isDarkMode.update(value => !value);
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
