import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../api/model/loginRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  onClose = output<void>();
  onSwitchToRegister = output<void>();

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isLoading = false;
  errorMsg = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';
    this.loginForm.disable();

    const credentials: LoginRequest = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.loginForm.enable();
        this.onClose.emit(); // Cierra el modal exitosamente
      },
      error: (err) => {
        this.isLoading = false;
        this.loginForm.enable();
        this.errorMsg = 'Credenciales incorrectas. Intenta nuevamente.';
        console.error(err);
      }
    });
  }
}
