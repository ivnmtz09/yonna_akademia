import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, Book, Languages, Trophy, User, LogOut, ArrowRight, Menu, X, Home, BookOpen, Smartphone, Sun, Moon, PanelLeftClose, PanelLeftOpen, Flag, Clock, Award, Zap, Users, Facebook, Twitter, Instagram, GraduationCap, AlertTriangle, Search, BookX, SearchX, LoaderCircle, Volume2 } from 'lucide-angular';
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
    { provide: BASE_PATH, useValue: 'http://127.0.0.1:8000' },
    importProvidersFrom(LucideAngularModule.pick({ LayoutDashboard, Book, Languages, Trophy, User, LogOut, ArrowRight, Menu, X, Home, BookOpen, Smartphone, Sun, Moon, PanelLeftClose, PanelLeftOpen, Flag, Clock, Award, Zap, Users, Facebook, Twitter, Instagram, GraduationCap, AlertTriangle, Search, BookX, SearchX, LoaderCircle, Volume2 }))
  ]
};