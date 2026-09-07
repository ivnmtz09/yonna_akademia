import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, Book, Languages, Trophy, User, LogOut, ArrowRight, ArrowLeft, Menu, X, Home, BookOpen, Smartphone, Sun, Moon, Monitor, Check, ChevronDown, PanelLeftClose, PanelLeftOpen, Flag, Clock, Award, Zap, Users, Facebook, Twitter, Instagram, GraduationCap, AlertTriangle, Search, BookX, SearchX, LoaderCircle, Volume2, FileText, ShieldCheck, Info, CircleAlert, Eye, EyeOff, Mail, Calendar, MapPin, Sparkles, CircleCheck, Pencil, Save, Phone, Shield, Flame, Compass } from 'lucide-angular';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { BASE_PATH } from './api'; // Importante: viene de la carpeta generada
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    { provide: BASE_PATH, useValue: environment.apiUrl },
    importProvidersFrom(LucideAngularModule.pick({ LayoutDashboard, Book, Languages, Trophy, User, LogOut, ArrowRight, ArrowLeft, Menu, X, Home, BookOpen, Smartphone, Sun, Moon, Monitor, Check, ChevronDown, PanelLeftClose, PanelLeftOpen, Flag, Clock, Award, Zap, Users, Facebook, Twitter, Instagram, GraduationCap, AlertTriangle, Search, BookX, SearchX, LoaderCircle, Volume2, FileText, ShieldCheck, Info, CircleAlert, Eye, EyeOff, Mail, Calendar, MapPin, Sparkles, CircleCheck, Pencil, Save, Phone, Shield, Flame, Compass }))
  ]
};