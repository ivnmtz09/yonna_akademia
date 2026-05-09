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
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="closeModal()"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 relative mx-4 transform transition-all border border-gray-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
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
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Crear Cuenta</h2>
            <p class="text-gray-500 dark:text-gray-400 font-medium">Únete a Yonna Akademia hoy mismo</p>
          </div>

          @if (errorMessage) {
            <div
              class="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center"
            >
              {{ errorMessage }}
            </div>
          }
          @if (successMessage) {
            <div
              class="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-medium text-center"
            >
              {{ successMessage }}
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >Nombre</label
              >
              <input
                type="text"
                formControlName="first_name"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200':
                    isFieldInvalid('first_name'),
                }"
                placeholder="Ej. María"
              />
              @if (isFieldInvalid('first_name')) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">
                  El nombre es requerido.
                </p>
              }
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >Apellido</label
              >
              <input
                type="text"
                formControlName="last_name"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200':
                    isFieldInvalid('last_name'),
                }"
                placeholder="Ej. Rodríguez"
              />
              @if (isFieldInvalid('last_name')) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">
                  El apellido es requerido.
                </p>
              }
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >Correo Electrónico</label
              >
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200': isFieldInvalid('email'),
                }"
                placeholder="tu@email.com"
              />
              @if (isFieldInvalid('email')) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">
                  Por favor, ingresa un correo válido.
                </p>
              }
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
              <input
                type="password"
                formControlName="password1"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200':
                    isFieldInvalid('password1'),
                }"
                placeholder="Mínimo 6 caracteres"
              />
              @if (isFieldInvalid('password1')) {
                @if (registerForm.get('password1')?.hasError('required')) {
                  <p class="text-red-500 text-xs mt-1.5 font-medium">La contraseña es requerida.</p>
                } @else if (registerForm.get('password1')?.hasError('minlength')) {
                  <p class="text-red-500 text-xs mt-1.5 font-medium">
                    La contraseña debe tener al menos 6 caracteres.
                  </p>
                }
              }
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >Confirmar Contraseña</label
              >
              <input
                type="password"
                formControlName="password2"
                class="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                [ngClass]="{
                  'border-red-300 focus:border-red-500 focus:ring-red-200':
                    isFieldInvalid('password2'),
                }"
                placeholder="Repite tu contraseña"
              />
              @if (
                isFieldInvalid('password2') &&
                registerForm.get('password2')?.hasError('required')
              ) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">La confirmación es requerida.</p>
              }
              @if (
                registerForm.get('password2')?.hasError('passwordMismatch') &&
                registerForm.get('password2')?.touched
              ) {
                <p class="text-red-500 text-xs mt-1.5 font-medium">Las contraseñas no coinciden.</p>
              }
            </div>

            <button
              type="submit"
              [ngClass]="{'pointer-events-none opacity-50': registerForm.invalid || isLoading || successMessage !== ''}"
              class="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-opacity-90 hover:shadow-lg hover:shadow-brand-orange/20 transition-all mt-6 text-lg flex items-center justify-center gap-2"
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
                Registrando...
              } @else {
                Completar Registro
              }
            </button>
          </form>

            <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-8 font-medium">
              ¿Ya tienes una cuenta?
              <button
                (click)="openLogin()"
                class="text-brand-green font-bold hover:underline ml-1"
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
