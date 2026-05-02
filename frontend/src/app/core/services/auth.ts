import { Injectable, inject, signal } from '@angular/core';
import { AutenticacinService } from '../../api/api/autenticacin.service';
import { LoginRequest } from '../../api/model/loginRequest';
import { RegisterRequest } from '../../api/model/registerRequest';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Login } from '../../api/model/login';
import { Register } from '../../api/model/register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiAuth = inject(AutenticacinService);
  
  public isAuthenticated = signal<boolean>(this.hasToken());

  login(credentials: LoginRequest): Observable<Login> {
    return this.apiAuth.authLoginCreate(credentials).pipe(
      tap((response: any) => {
        if (response && response.access) {
          localStorage.setItem('access_token', response.access);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<Register> {
    return this.apiAuth.authRegisterCreate(data);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isAuthenticated.set(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
