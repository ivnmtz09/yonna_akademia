import { Component, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UiService } from '../../../../core/services/ui.service';
import { AuthService } from '../../../../core/services/auth';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password1 = control.get('password1');
  const password2 = control.get('password2');

  if (password1 && password2 && password1.value !== password2.value) {
    password2.setErrors({ ...password2.errors, passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (password2?.hasError('passwordMismatch')) {
      const errors = { ...password2.errors };
      delete errors['passwordMismatch'];
      password2.setErrors(Object.keys(errors).length ? errors : null);
    }
  }
  return null;
}

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    @if (ui.isRegisterModalOpen()) {
      <div
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-md transition-opacity"
        (click)="closeModal()"
      >
        <div
          class="glass-modal rounded-3xl w-full max-w-md p-8 relative mx-4 transform transition-all max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <button
            (click)="closeModal()"
            class="absolute right-5 top-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            [ngClass]="{'pointer-events-none opacity-50': isLoading || isGoogleLoading}"
          >
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>

          <div class="text-center mb-6 mt-2">
            <h2 class="text-3xl font-display font-extrabold text-zinc-900 dark:text-white mb-1.5 tracking-tight">Crear Cuenta</h2>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Únete a Yonna Akademia hoy mismo</p>
          </div>

          @if (errorMessage) {
            <div
              class="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl text-xs font-medium text-center"
            >
              {{ errorMessage }}
            </div>
          }
          @if (successMessage) {
            <div
              class="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-medium text-center"
            >
              {{ successMessage }}
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5">
                Nombre
              </label>
              <input
                type="text"
                formControlName="first_name"
                class="w-full px-4 py-3 rounded-xl glass-input text-sm"
                [ngClass]="{
                  '!border-red-400 focus:!ring-red-300': isFieldInvalid('first_name'),
                }"
                placeholder="Ej. María"
              />
              @if (isFieldInvalid('first_name')) {
                <p class="text-red-500 text-xs mt-1 font-medium">
                  El nombre es requerido.
                </p>
              }
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5">
                Apellido
              </label>
              <input
                type="text"
                formControlName="last_name"
                class="w-full px-4 py-3 rounded-xl glass-input text-sm"
                [ngClass]="{
                  '!border-red-400 focus:!ring-red-300': isFieldInvalid('last_name'),
                }"
                placeholder="Ej. Rodríguez"
              />
              @if (isFieldInvalid('last_name')) {
                <p class="text-red-500 text-xs mt-1 font-medium">
                  El apellido es requerido.
                </p>
              }
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 rounded-xl glass-input text-sm"
                [ngClass]="{
                  '!border-red-400 focus:!ring-red-300': isFieldInvalid('email'),
                }"
                placeholder="tu@correo.com"
              />
              @if (isFieldInvalid('email')) {
                <p class="text-red-500 text-xs mt-1 font-medium">
                  Ingresa un correo electrónico válido.
                </p>
              }
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5">
                Contraseña
              </label>
              <div class="relative">
                <input
                  [type]="showPassword1 ? 'text' : 'password'"
                  formControlName="password1"
                  class="w-full px-4 py-3 pr-11 rounded-xl glass-input text-sm"
                  [ngClass]="{
                    '!border-red-400 focus:!ring-red-300': isFieldInvalid('password1'),
                  }"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  (click)="showPassword1 = !showPassword1"
                  tabindex="-1"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  [attr.aria-label]="showPassword1 ? 'Ocultar contraseña' : 'Ver contraseña'"
                >
                  <lucide-icon [name]="showPassword1 ? 'eye-off' : 'eye'" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
              @if (isFieldInvalid('password1')) {
                @if (registerForm.get('password1')?.hasError('required')) {
                  <p class="text-red-500 text-xs mt-1 font-medium">La contraseña es requerida.</p>
                } @else if (registerForm.get('password1')?.hasError('minlength')) {
                  <p class="text-red-500 text-xs mt-1 font-medium">
                    La contraseña debe tener al menos 6 caracteres.
                  </p>
                }
              }
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5">
                Confirmar Contraseña
              </label>
              <div class="relative">
                <input
                  [type]="showPassword2 ? 'text' : 'password'"
                  formControlName="password2"
                  class="w-full px-4 py-3 pr-11 rounded-xl glass-input text-sm"
                  [ngClass]="{
                    '!border-red-400 focus:!ring-red-300': isFieldInvalid('password2'),
                  }"
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  (click)="showPassword2 = !showPassword2"
                  tabindex="-1"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  [attr.aria-label]="showPassword2 ? 'Ocultar contraseña' : 'Ver contraseña'"
                >
                  <lucide-icon [name]="showPassword2 ? 'eye-off' : 'eye'" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
              @if (
                isFieldInvalid('password2') &&
                registerForm.get('password2')?.hasError('required')
              ) {
                <p class="text-red-500 text-xs mt-1 font-medium">La confirmación es requerida.</p>
              }
              @if (
                registerForm.get('password2')?.hasError('passwordMismatch') &&
                registerForm.get('password2')?.touched
              ) {
                <p class="text-red-500 text-xs mt-1 font-medium">Las contraseñas no coinciden.</p>
              }
            </div>

            <button
              type="submit"
              [ngClass]="{'pointer-events-none opacity-50': registerForm.invalid || isLoading || isGoogleLoading || successMessage !== ''}"
              class="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand-orange/20 mt-4 text-base flex items-center justify-center gap-2"
            >
              @if (isLoading) {
                <lucide-icon name="loader-circle" class="w-5 h-5 animate-spin"></lucide-icon>
                <span>Registrando...</span>
              } @else {
                <span>Completar Registro</span>
              }
            </button>
          </form>

          <!-- Separador -->
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-zinc-200/80 dark:border-zinc-800"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white dark:bg-zinc-900 px-3 text-zinc-400 dark:text-zinc-500 font-semibold">o regístrate con</span>
            </div>
          </div>

          <!-- Botón Google OAuth2 -->
          <div class="flex flex-col items-center justify-center w-full min-h-[44px]">
            <div id="google-register-btn-container" class="w-full flex justify-center"></div>
            <button
              type="button"
              id="google-register-btn-fallback"
              (click)="signInWithGoogle()"
              [disabled]="isLoading || isGoogleLoading"
              class="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2.5 hover:-translate-y-0.5 disabled:opacity-50"
            >
              @if (isGoogleLoading) {
                <lucide-icon name="loader-circle" class="w-4 h-4 text-brand-green animate-spin"></lucide-icon>
                <span>Conectando con Google...</span>
              } @else {
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Registrarse con Google</span>
              }
            </button>
          </div>

          <p class="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6 font-medium">
            ¿Ya tienes una cuenta?
            <button
              (click)="openLogin()"
              class="text-brand-green dark:text-emerald-400 font-bold hover:underline ml-1"
              [ngClass]="{'pointer-events-none opacity-50': isLoading || isGoogleLoading}"
            >
              Ingresa aquí
            </button>
          </p>
        </div>
      </div>
    }
  `,
})
export class RegisterModalComponent implements OnDestroy {
  ui = inject(UiService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  isGoogleLoading = false;
  showPassword1 = false;
  showPassword2 = false;
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor() {
    this.registerForm = this.fb.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password1: ['', [Validators.required, Validators.minLength(6)]],
        password2: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );

    effect(() => {
      if (this.ui.isRegisterModalOpen()) {
        setTimeout(() => this.initGoogleSignIn(), 100);
      } else {
        this.resetForm();
      }
    });
  }

  initGoogleSignIn(): void {
    if (typeof (window as any).google !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleCredential(response?.credential),
          auto_select: false,
        });

        const btnContainer = document.getElementById('google-register-btn-container');
        const fallbackBtn = document.getElementById('google-register-btn-fallback');
        if (btnContainer) {
          btnContainer.innerHTML = '';
          (window as any).google.accounts.id.renderButton(btnContainer, {
            type: 'standard',
            shape: 'pill',
            theme: this.ui.isDarkMode() ? 'filled_black' : 'outline',
            text: 'signup_with',
            size: 'large',
            width: 320,
            logo_alignment: 'left',
          });
          if (fallbackBtn) {
            fallbackBtn.style.display = 'none';
          }
        }
      } catch (err) {
        console.warn('Google GIS register render fallback:', err);
      }
    }
  }

  signInWithGoogle(): void {
    if (typeof (window as any).google !== 'undefined' && (window as any).google?.accounts?.id) {
      this.isGoogleLoading = true;
      (window as any).google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleCredential(response?.credential),
      });
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          this.isGoogleLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Google Sign-In se está cargando. Por favor, intenta de nuevo.';
    }
  }

  handleGoogleCredential(credential: string): void {
    if (!credential) {
      this.errorMessage = 'No se recibió la credencial de Google.';
      this.isGoogleLoading = false;
      return;
    }
    this.isGoogleLoading = true;
    this.errorMessage = '';

    this.auth
      .loginWithGoogle(credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isGoogleLoading = false;
          this.ui.closeRegisterModal();
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.isGoogleLoading = false;
          this.errorMessage = err.message || 'Error al autenticar con Google.';
          console.error('Google Auth Error:', err);
        },
      });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.registerForm.disable();
    this.errorMessage = '';
    this.successMessage = '';

    const { first_name, last_name, email, password1, password2 } = this.registerForm.value;

    this.auth
      .register({ first_name, last_name, email, password1, password2 })
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.registerForm.enable();
          this.errorMessage =
            err.error?.detail ||
            err.error?.first_name?.[0] ||
            err.error?.last_name?.[0] ||
            err.error?.email?.[0] ||
            err.error?.password1?.[0] ||
            'Ocurrió un error en el registro.';
          this.isLoading = false;
          return of(null);
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.registerForm.enable();
          this.isLoading = false;
          this.successMessage = '¡Cuenta creada con éxito! Iniciando sesión...';

          this.auth
            .login({ email, password: password1 })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                setTimeout(() => {
                  this.ui.closeRegisterModal();
                  this.router.navigate(['/dashboard']);
                }, 1000);
              },
              error: () => {
                this.successMessage = 'Registro exitoso. Por favor ingresa a tu cuenta.';
                setTimeout(() => {
                  this.ui.openLoginModal();
                }, 1500);
              },
            });
        }
      });
  }

  closeModal() {
    if (!this.isLoading && !this.isGoogleLoading) {
      this.ui.closeRegisterModal();
    }
  }

  openLogin() {
    this.ui.openLoginModal();
  }

  private resetForm() {
    this.registerForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
    this.isGoogleLoading = false;
    this.showPassword1 = false;
    this.showPassword2 = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
