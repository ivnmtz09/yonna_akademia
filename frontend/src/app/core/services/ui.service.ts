import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private readonly _isLoginModalOpen = signal(false);
  private readonly _isRegisterModalOpen = signal(false);
  private readonly _isMobileMenuOpen = signal(false);

  readonly isLoginModalOpen = this._isLoginModalOpen.asReadonly();
  readonly isRegisterModalOpen = this._isRegisterModalOpen.asReadonly();
  readonly isMobileMenuOpen = this._isMobileMenuOpen.asReadonly();

  // Modal de Inicio de Sesión
  openLoginModal() {
    this._isLoginModalOpen.set(true);
    this._isRegisterModalOpen.set(false);
    this._isMobileMenuOpen.set(false);
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
    this._isMobileMenuOpen.set(false);
  }
  closeRegisterModal() {
    this._isRegisterModalOpen.set(false);
  }
  toggleRegisterModal() {
    this._isRegisterModalOpen.update(v => !v);
  }

  // Menú Móvil
  openMobileMenu() {
    this._isMobileMenuOpen.set(true);
  }
  closeMobileMenu() {
    this._isMobileMenuOpen.set(false);
  }
  toggleMobileMenu() {
    this._isMobileMenuOpen.update(v => !v);
  }
}
