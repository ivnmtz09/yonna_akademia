import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { BASE_PATH } from './api'; // Importante: viene de la carpeta generada

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // Usamos 127.0.0.1 para evitar problemas de resolución de DNS con Java
    { provide: BASE_PATH, useValue: 'http://127.0.0.1:8000' }
  ]
};