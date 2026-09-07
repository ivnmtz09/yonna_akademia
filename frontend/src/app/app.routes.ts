import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'diccionario',
    loadComponent: () => import('./features/dictionary/dictionary').then(m => m.DictionaryComponent)
  },
  {
    path: 'cursos',
    loadComponent: () => import('./features/courses/courses').then(m => m.CoursesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'terminos-condiciones',
    loadComponent: () => import('./features/legal/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'politica-privacidad',
    loadComponent: () => import('./features/legal/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
