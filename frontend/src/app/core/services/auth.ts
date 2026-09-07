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
  public currentUser = signal<any>(this.getInitialUser());

  constructor() {
    if (this.tokenService.hasToken() && !this.tokenService.isTokenExpired()) {
      this.fetchProfile().subscribe({
        error: () => {}
      });
    }
  }

  private getInitialUser(): any {
    const token = this.tokenService.getAccessToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      const decoded = this.tokenService.decodeToken(token);
      if (decoded) {
        return {
          id: decoded.user_id || decoded.sub,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role || 'user',
          level: decoded.level || 1,
          xp: decoded.xp || 0,
        };
      }
    }
    return null;
  }

  /**
   * Obtiene el perfil completo del usuario autenticado
   */
  fetchProfile(): Observable<any> {
    return this.http.get<any>(`${this.basePath}/api/auth/profile/`).pipe(
      tap((userData: any) => {
        if (userData) {
          const current = this.currentUser() || {};
          this.currentUser.set({
            ...current,
            id: userData.id,
            email: userData.email,
            username: userData.username,
            first_name: userData.first_name,
            last_name: userData.last_name,
            bio: userData.bio,
            role: userData.role || current.role || 'user',
            level: userData.level ?? current.level ?? 1,
            xp: userData.xp ?? current.xp ?? 0,
            date_joined: userData.date_joined,
            profile: userData.profile || current.profile || {}
          });
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Actualiza el perfil del usuario autenticado
   */
  updateProfile(data: any): Observable<any> {
    return this.http.patch<any>(`${this.basePath}/api/auth/profile/`, data).pipe(
      tap((updatedUser: any) => {
        if (updatedUser) {
          const current = this.currentUser() || {};
          this.currentUser.set({
            ...current,
            ...updatedUser,
            profile: updatedUser.profile || current.profile || {}
          });
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

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
          this.currentUser.set({
            id: response.id || decoded?.user_id || decoded?.sub,
            email: response.email || decoded?.email,
            username: response.username || decoded?.username || `${response.first_name || ''} ${response.last_name || ''}`.trim(),
            first_name: response.first_name,
            last_name: response.last_name,
            role: response.role || decoded?.role || 'user',
            level: response.level || decoded?.level || 1,
            xp: response.xp || decoded?.xp || 0,
            profile: response.profile || {}
          });
          this.fetchProfile().subscribe({ error: () => {} });
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
          this.currentUser.set({
            id: response.id || decoded?.user_id || decoded?.sub,
            email: response.email || decoded?.email,
            username: response.username || decoded?.username,
            first_name: response.first_name,
            last_name: response.last_name,
            bio: response.bio,
            role: response.role || decoded?.role || 'user',
            level: response.level || decoded?.level || 1,
            xp: response.xp || decoded?.xp || 0,
            date_joined: response.date_joined,
            profile: response.profile || {}
          });
          this.fetchProfile().subscribe({ error: () => {} });
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
