import { Component, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UiService } from '../../../../core/services/ui.service';
import { AuthService } from '../../../../core/services/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    @if (ui.isLoginModalOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="closeModal()"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative mx-4 transform transition-all border border-gray-100"
          (click)="$event.stopPropagation()"
        >
          <button
            (click)="closeModal()"
            class="absolute right-5 top-5 p-2 bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            [disabled]="isLoading"
          >
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>

          <div class="text-center mb-6 mt-2">
            <h2 class="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p class="text-gray-500 font-medium">Ingresa a tu cuenta para continuar</p>
          </div>

          @if (errorMessage) {
            <div
              class="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center"
            >
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5"
                >Correo Electrónico</label
              >
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200': isFieldInvalid('email'),
                }"
                placeholder="tu@email.com"
                [disabled]="isLoading"
              />
              @if (isFieldInvalid('email')) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">
                  @if (loginForm.get('email')?.hasError('required')) {
                    Por favor, ingresa tu correo electrónico.
                  } @else if (loginForm.get('email')?.hasError('email')) {
                    Por favor, ingresa un correo válido.
                  }
                </p>
              }
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200':
                    isFieldInvalid('password'),
                }"
                placeholder="••••••••"
                [disabled]="isLoading"
              />
              @if (isFieldInvalid('password')) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">La contraseña es requerida.</p>
              }
            </div>

            <div class="flex items-center justify-between pt-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded text-brand-green border-gray-300 focus:ring-brand-green"
                  [disabled]="isLoading"
                />
                <span class="text-sm text-gray-600 font-medium">Recordarme</span>
              </label>
              <a href="#" class="text-sm text-brand-green hover:underline font-bold"
                >¿Olvidaste tu clave?</a
              >
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-opacity-90 hover:shadow-lg hover:shadow-brand-green/20 transition-all mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              @if (isLoading) {
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Ingresando...
              } @else {
                Ingresar a mi cuenta
              }
            </button>
          </form>

          <p class="text-center text-sm text-gray-600 mt-8 font-medium">
            ¿No tienes una cuenta?
            <button
              (click)="openRegister()"
              class="text-brand-orange font-bold hover:underline ml-1"
              [disabled]="isLoading"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    }
  `,
})
export class LoginModalComponent implements OnDestroy {
  ui = inject(UiService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Limpiar formulario cuando el modal se cierre
    effect(() => {
      if (!this.ui.isLoginModalOpen()) {
        this.resetForm();
      }
    });
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.auth
      .login(this.loginForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          // Cerrar el modal tras el login exitoso
          this.ui.closeLoginModal();
        },
        error: (error) => {
          this.isLoading = false;
          // Mostrar mensaje de error específico del servidor
          this.errorMessage = error.message || 'Credenciales incorrectas o ha ocurrido un error.';

          // Log para debugging (remover en producción)
          console.error('Login error:', error);
        },
      });
  }

  /**
   * Cierra el modal de login
   */
  closeModal(): void {
    if (!this.isLoading) {
      this.ui.closeLoginModal();
    }
  }

  /**
   * Abre el modal de registro
   */
  openRegister(): void {
    this.ui.openRegisterModal();
  }

  /**
   * Resetea el formulario y los estados
   */
  private resetForm(): void {
    this.loginForm.reset();
    this.errorMessage = '';
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
