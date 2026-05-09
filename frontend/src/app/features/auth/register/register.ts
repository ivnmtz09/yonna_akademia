import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { RegisterRequest } from '../../../api/model/registerRequest';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  onClose = output<void>();
  onSwitchToLogin = output<void>();

  registerForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  isLoading = false;
  errorMsg = '';

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';
    this.registerForm.disable();

    const data: RegisterRequest = this.registerForm.getRawValue() as any;

    this.authService.register(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.registerForm.enable();
        // Optionally auto-login or switch to login
        this.onSwitchToLogin.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.registerForm.enable();
        this.errorMsg = 'Error al crear la cuenta. Verifica los datos.';
        console.error(err);
      }
    });
  }
}
