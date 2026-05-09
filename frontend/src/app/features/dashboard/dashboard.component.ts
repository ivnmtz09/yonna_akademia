import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { UiService } from '../../core/services/ui.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { GamificacinService } from '../../api/api/gamificacin.service';
import { CursosService } from '../../api/api/cursos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LeaderboardEntry } from '../../api/model/leaderboardEntry';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive, StatCardComponent],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-slate-900">
      <!-- Sidebar for Desktop -->
      <aside [class.hidden]="uiService.isMobile() && !uiService.isSidebarOpen()" class="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex-col fixed h-full left-0 top-0 z-50 md:flex">
        <div class="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3 cursor-pointer" routerLink="/">
          <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-8 h-8 object-contain">
          <span class="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Akademia</span>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="layout-dashboard" class="w-5 h-5"></lucide-icon>
            Mi Dashboard
          </a>
          <a routerLink="/dashboard/cursos" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="book" class="w-5 h-5"></lucide-icon>
            Cursos
          </a>
          <a routerLink="/dashboard/diccionario" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="book-open" class="w-5 h-5"></lucide-icon>
            Diccionario
          </a>
          <a routerLink="/dashboard/logros" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="trophy" class="w-5 h-5"></lucide-icon>
            Logros
          </a>
          <a routerLink="/dashboard/perfil" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="user" class="w-5 h-5"></lucide-icon>
            Perfil
          </a>
        </nav>
    
        <div class="p-4 border-t border-gray-100 dark:border-slate-700">
          <button 
            (click)="logout()" 
            class="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-xl transition-colors"
          >
            <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
            Cerrar Sesión
          </button>
        </div>
      </aside>
  
      <!-- Overlay for mobile sidebar -->
      @if (uiService.isSidebarOpen() && uiService.isMobile()) {
        <div class="fixed inset-0 bg-black/50 z-40 md:hidden" (click)="uiService.closeSidebar()"></div>
      }
  
      <!-- Main Content -->
      <div class="flex-1 flex flex-col md:ml-64">
        <!-- Mobile Header/Toggle -->
        <header class="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between md:hidden">
          <button (click)="uiService.toggleSidebar()" class="text-gray-600 dark:text-gray-300">
            <lucide-icon name="menu" class="w-6 h-6"></lucide-icon>
          </button>
          <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-8 h-8 object-contain">
          <span class="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Akademia</span>
          <div></div>
        </header>
    
        <main class="flex-1 p-8 overflow-y-auto">
          <div class="max-w-4xl mx-auto">
            @switch (userRole) {
              @case ('admin') {
                <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 mb-8">
                  <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Panel de Administración</h1>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <app-stat-card icon="users" label="Usuarios Totales" [value]="adminStats().totalUsers ?? '—'" />
                    <app-stat-card icon="book" label="Cursos Totales" [value]="adminStats().totalCourses ?? '—'" />
                    <app-stat-card icon="trending-up" label="Inscripciones" [value]="adminStats().totalEnrollments ?? '—'" />
                  </div>
                  <div class="flex gap-4">
                    <button class="bg-brand-green text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                      Gestionar Usuarios
                    </button>
                    <button class="bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                      Gestionar Cursos
                    </button>
                  </div>
                </div>

                @if (leaderboardEntries().length > 0) {
                  <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <lucide-icon name="trophy" class="w-6 h-6 text-brand-orange"></lucide-icon>
                      Leaderboard Global
                    </h2>
                    <div class="space-y-3">
                      @for (entry of leaderboardEntries(); track entry.user_id; let i = $index) {
                        <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                             [class.bg-brand-orange/5]="i === 0"
                             [class.border]="i === 0"
                             [class.border-brand-orange/20]="i === 0">
                          <div class="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm"
                               [class]="i === 0 ? 'bg-brand-orange text-white' : i === 1 ? 'bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-200' : i === 2 ? 'bg-amber-700/20 text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'">
                            {{ entry.rank }}
                          </div>
                          <div class="w-10 h-10 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center">
                            <lucide-icon name="user" class="w-5 h-5 text-brand-green"></lucide-icon>
                          </div>
                          <div class="flex-1">
                            <p class="font-semibold text-gray-900 dark:text-white">{{ entry.username }}</p>
                          </div>
                          <div class="text-right">
                            <p class="font-bold text-gray-900 dark:text-white">{{ entry.total_xp }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">XP</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              }
              @case ('moderator') {
                <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 mb-8">
                  <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Panel de Moderación</h1>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <app-stat-card icon="flag" label="Reportes Pendientes" value="8" />
                    <app-stat-card icon="clock" label="Contenido por Revisar" value="12" />
                  </div>
                  <button class="bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                    Ver Reportes
                  </button>
                </div>
              }
              @default {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <app-stat-card icon="award" label="Nivel Actual" [value]="user?.level || 1" />
                  <app-stat-card icon="zap" label="Progreso XP" [value]="(user?.xp || 0) + ' XP'" [progress]="getXpProgress()" />
                </div>

                <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                  <div class="flex-1 z-10">
                    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                      ¡Bienvenido, <span class="text-brand-orange">{{ userName }}</span>!
                    </h1>
                    <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Estamos muy felices de verte aquí. Tu viaje de aprendizaje en Yonna Akademia acaba de comenzar.
                      ¡Explora tus cursos, revisa tu progreso y diviértete aprendiendo!
                    </p>
                    <div class="flex gap-4">
                      <button routerLink="/dashboard/cursos" class="bg-brand-green text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20">
                        Ver mis cursos
                      </button>
                      <button routerLink="/dashboard/logros" class="bg-white border-2 border-brand-green text-brand-green px-6 py-3 rounded-xl font-bold hover:bg-brand-light-green transition-all">
                        Mis Logros
                      </button>
                    </div>
                  </div>
                  
                  <div class="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 z-10">
                    <img 
                      [src]="mascotImage" 
                      alt="Mascota" 
                      class="w-full h-full object-cover rounded-2xl shadow-md border-4 border-white"
                      onerror="this.src='https://placehold.co/400?text=Mascota+Yonna&bg=F97316&textColor=fff';"
                    />
                  </div>
                  
                  <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand-orange/5 blur-3xl z-0"></div>
                  <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-brand-green/5 blur-3xl z-0"></div>
                </div>

                @if (leaderboardEntries().length > 0) {
                  <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 mt-8">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <lucide-icon name="trophy" class="w-6 h-6 text-brand-orange"></lucide-icon>
                      Leaderboard Global
                    </h2>
                    <div class="space-y-3">
                      @for (entry of leaderboardEntries(); track entry.user_id; let i = $index) {
                        <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                             [class.bg-brand-orange/5]="i === 0"
                             [class.border]="i === 0"
                             [class.border-brand-orange/20]="i === 0">
                          <div class="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm"
                               [class]="i === 0 ? 'bg-brand-orange text-white' : i === 1 ? 'bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-200' : i === 2 ? 'bg-amber-700/20 text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'">
                            {{ entry.rank }}
                          </div>
                          <div class="w-10 h-10 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center">
                            <lucide-icon name="user" class="w-5 h-5 text-brand-green"></lucide-icon>
                          </div>
                          <div class="flex-1">
                            <p class="font-semibold text-gray-900 dark:text-white">{{ entry.username }}</p>
                          </div>
                          <div class="text-right">
                            <p class="font-bold text-gray-900 dark:text-white">{{ entry.total_xp }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">XP</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              }
            }
          </div>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private gamificacionService = inject(GamificacinService);
  private cursosService = inject(CursosService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  userName: string = 'Estudiante';
  uiService = inject(UiService);

  leaderboardEntries = signal<LeaderboardEntry[]>([]);
  adminStats = signal<{ totalUsers?: number; totalCourses?: number; totalEnrollments?: number }>({});

  get user() {
    return this.authService.currentUser();
  }

  get userRole(): string {
    return this.user?.role || 'user';
  }

  get mascotImage(): string {
    const role = this.userRole;
    if (role === 'admin') return 'assets/mascot/saludo.png';
    if (role === 'moderator') return 'assets/mascot/mascota.png';
    return 'assets/mascot/welcome.png';
  }

  getXpProgress(): number {
    const user = this.user;
    if (!user) return 0;
    const xp = user.xp || 0;
    const level = user.level || 1;
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    const currentMin = thresholds[level - 1] || 0;
    const nextMin = thresholds[level] || currentMin + 100;
    return Math.min(100, Math.max(0, ((xp - currentMin) / (nextMin - currentMin)) * 100));
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && user.username) {
      this.userName = user.username;
    } else if (user && user.first_name) {
      this.userName = user.first_name;
    }

    this.loadLeaderboard();

    if (this.userRole === 'admin') {
      this.loadAdminStats();
    }
  }

  private loadLeaderboard(): void {
    this.gamificacionService.gamificationLeaderboardList(10).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.leaderboardEntries.set(response.results);
      },
      error: () => {},
    });
  }

  private loadAdminStats(): void {
    this.cursosService.coursesStatisticsRetrieve().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response: any) => {
        this.adminStats.set({
          totalCourses: response.total_courses,
          totalEnrollments: response.total_enrollments,
          totalUsers: undefined,
        });
      },
      error: () => {},
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
