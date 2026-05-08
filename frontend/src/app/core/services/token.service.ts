import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private tokenSignal = signal<string | null>(this.getAccessToken());
  public readonly token = this.tokenSignal.asReadonly();
  
  // Computed signal to reactively know if user is authenticated
  public readonly isAuthenticated = computed(() => !!this.tokenSignal() && !this.isTokenExpired(this.tokenSignal()!));

  /**
   * Cierra la sesión limpiando los tokens
   */
  logout(): void {
    this.clearTokens();
  }

  /**
   * Almacena los tokens de forma segura (en este caso, localStorage)
   * En una aplicación de producción, se recomienda usar un almacenamiento más seguro
   * como httpOnly cookies o una solución de gestión de secretos
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    this.setAccessToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

  /**
   * Almacena el token de acceso
   */
  setAccessToken(token: string): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      this.tokenSignal.set(token);
    } catch (error) {
      console.error('Error storing access token:', error);
    }
  }

  /**
   * Almacena el token de refresco
   */
  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing refresh token:', error);
    }
  }

  /**
   * Obtiene el token de acceso
   */
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  /**
   * Obtiene el token de refresco
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  /**
   * Verifica si existe un token de acceso válido
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Limpia todos los tokens
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      this.tokenSignal.set(null);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Decodifica un token JWT para obtener sus claims (sin validar firma)
   * NOTA: Esto es solo para lectura de información. No valida la firma.
   */
  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) {
      return true;
    }

    const decoded = this.decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) {
      return false; // Si no podemos decodificarlo, asumimos que es válido
    }

    const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
    const currentTime = Date.now();

    // Retornar true si el token ha expirado (con 5 segundos de margen)
    return currentTime >= expirationTime - 5000;
  }
}
