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

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password1 = control.get('password1');
  const password2 = control.get('password2');

  if (password1 && password2 && password1.value !== password2.value) {
    // Setting error on the password2 control
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
            [ngClass]="{'pointer-events-none opacity-50': isLoading}"
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
              <input
                type="password"
                formControlName="password1"
                class="w-full px-4 py-3 rounded-xl glass-input text-sm"
                [ngClass]="{
                  '!border-red-400 focus:!ring-red-300': isFieldInvalid('password1'),
                }"
                placeholder="Mínimo 6 caracteres"
              />
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
              <input
                type="password"
                formControlName="password2"
                class="w-full px-4 py-3 rounded-xl glass-input text-sm"
                [ngClass]="{
                  '!border-red-400 focus:!ring-red-300': isFieldInvalid('password2'),
                }"
                placeholder="Repite tu contraseña"
              />
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
              [ngClass]="{'pointer-events-none opacity-50': registerForm.invalid || isLoading || successMessage !== ''}"
              class="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand-orange/20 mt-4 text-base flex items-center justify-center gap-2"
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
                <span>Registrando...</span>
              } @else {
                <span>Completar Registro</span>
              }
            </button>
          </form>

          <p class="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6 font-medium">
            ¿Ya tienes una cuenta?
            <button
              (click)="openLogin()"
              class="text-brand-green dark:text-emerald-400 font-bold hover:underline ml-1"
              [ngClass]="{'pointer-events-none opacity-50': isLoading}"
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
      if (!this.ui.isRegisterModalOpen()) {
        this.resetForm();
      }
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
    if (!this.isLoading) {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
