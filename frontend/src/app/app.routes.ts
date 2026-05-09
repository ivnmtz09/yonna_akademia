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
  { path: '**', redirectTo: '' }
];
