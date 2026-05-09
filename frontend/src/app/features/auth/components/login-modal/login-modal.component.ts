import { Component, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="closeModal()"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 relative mx-4 transform transition-all border border-gray-100 dark:border-slate-700"
          (click)="$event.stopPropagation()"
        >
          <button
            (click)="closeModal()"
            class="absolute right-5 top-5 p-2 bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            [ngClass]="{'pointer-events-none opacity-50': isLoading}"
          >
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>

          <div class="text-center mb-6 mt-2">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p class="text-gray-500 dark:text-gray-400 font-medium">Ingresa a tu cuenta para continuar</p>
          </div>

          @if (loginError) {
            <div
              class="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center"
            >
              {{ loginError }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >Correo Electrónico</label
              >
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200': isFieldInvalid('email'),
                }"
                placeholder="tu@email.com"
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
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200':
                    isFieldInvalid('password'),
                }"
                placeholder="••••••••"
              />
              @if (isFieldInvalid('password')) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">La contraseña es requerida.</p>
              }
            </div>

            <div class="flex items-center justify-between pt-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded text-brand-green border-gray-300 dark:border-slate-600 focus:ring-brand-green bg-gray-50 dark:bg-slate-800"
                />
                <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">Recordarme</span>
              </label>
              <a href="#" class="text-sm text-brand-green hover:underline font-bold"
                >¿Olvidaste tu clave?</a
              >
            </div>

            <button
              type="submit"
              [ngClass]="{'pointer-events-none opacity-50': isLoading}"
              class="w-full bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-opacity-90 hover:shadow-lg hover:shadow-brand-green/20 transition-all mt-6 text-lg flex items-center justify-center gap-2"
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

            <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-8 font-medium">
              ¿No tienes una cuenta?
              <button
                (click)="openRegister()"
                class="text-brand-orange font-bold hover:underline ml-1"
                [ngClass]="{'pointer-events-none opacity-50': isLoading}"
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
  router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

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
    // Forzar lectura del DOM en caso de que el autocompletado no haya disparado el evento de Angular
    const emailInput = document.querySelector('input[formControlName="email"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[formControlName="password"]') as HTMLInputElement;

    if (emailInput?.value && !this.loginForm.value.email) {
      this.loginForm.patchValue({ email: emailInput.value });
    }
    if (passwordInput?.value && !this.loginForm.value.password) {
      this.loginForm.patchValue({ password: passwordInput.value });
    }

    console.log('Datos enviados a Django:', this.loginForm.value);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginForm.disable();
    this.loginError = '';

    this.auth
      .login(this.loginForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.loginForm.enable();
          this.ui.closeLoginModal();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.loginForm.enable();
          if (error.status === 401) {
            this.loginError = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
          } else {
            this.loginError = error.message || 'Credenciales incorrectas o ha ocurrido un error.';
          }
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
    this.loginError = '';
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
