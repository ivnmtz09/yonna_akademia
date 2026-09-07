import { Injectable, inject, signal } from '@angular/core';
import { AutenticacinService } from '../../api/api/autenticacin.service';
import { LoginRequest } from '../../api/model/loginRequest';
import { RegisterRequest } from '../../api/model/registerRequest';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Login } from '../../api/model/login';
import { Register } from '../../api/model/register';
import { TokenService } from './token.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_PATH } from '../../api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiAuth = inject(AutenticacinService);
  private tokenService = inject(TokenService);
  private http = inject(HttpClient);
  private basePath = inject(BASE_PATH);

  public isAuthenticated = signal<boolean>(this.tokenService.hasToken());
  public currentUser = signal<any>(null);

  /**
   * Realiza el login o registro mediante Google OAuth2 (id_token)
   */
  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.basePath}/api/auth/google/`, { id_token: idToken }).pipe(
      tap((response: any) => {
        if (response && response.access) {
          this.tokenService.setTokens(response.access, response.refresh);
          this.isAuthenticated.set(true);

          const decoded = this.tokenService.decodeToken(response.access);
          if (decoded) {
            this.currentUser.set({
              id: decoded.user_id || decoded.sub,
              email: decoded.email,
              username: decoded.username || `${response.first_name || ''} ${response.last_name || ''}`.trim(),
              role: decoded.role || response.role || 'user',
              level: decoded.level || response.level || 1,
              xp: decoded.xp || response.xp || 0,
            });
          }
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Realiza el login del usuario
   */
  login(credentials: LoginRequest): Observable<Login> {
    return this.apiAuth.authLoginCreate(credentials).pipe(
      tap((response: any) => {
        if (response && response.access) {
          // Guardar tokens de forma segura
          this.tokenService.setTokens(response.access, response.refresh);
          this.isAuthenticated.set(true);

          // Decodificar y guardar información del usuario
          const decoded = this.tokenService.decodeToken(response.access);
          if (decoded) {
              this.currentUser.set({
                id: decoded.user_id || decoded.sub,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role || 'user',
                level: decoded.level || 1,
                xp: decoded.xp || 0,
              });
          }
        }
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Realiza el registro del usuario
   */
  register(data: RegisterRequest): Observable<Register> {
    return this.apiAuth
      .authRegisterCreate(data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Realiza el logout del usuario
   */
  logout(): void {
    this.tokenService.logout();
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  /**
   * Obtiene el token de acceso actual
   */
  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired(): boolean {
    return this.tokenService.isTokenExpired();
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    let errorDetails: any = {};

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        if (error.status === 400) {
          // Errores de validación
          errorDetails = error.error;
          if (typeof error.error === 'object') {
            // Django REST Framework devuelve errores como objeto con campos
            const errorKeys = Object.keys(error.error);
            if (errorKeys.length > 0) {
              const firstError = error.error[errorKeys[0]];
              errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            }
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
        } else if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (error.status === 403) {
          errorMessage = 'Acceso denegado';
        } else if (error.status === 404) {
          errorMessage = 'Usuario no encontrado';
        } else if (error.status === 409) {
          errorMessage = 'El usuario ya existe';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Intenta de nuevo más tarde.';
        } else {
          errorMessage = error.error?.detail || error.message || 'Error desconocido';
        }
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return throwError(() => ({
      message: errorMessage,
      details: errorDetails,
      status: error?.status,
    }));
  }
}
