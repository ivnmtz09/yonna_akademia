import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { UiService } from '../../core/services/ui.service';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { GamificacinService } from '../../api/api/gamificacin.service';
import { CursosService } from '../../api/api/cursos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LeaderboardEntry } from '../../api/model/leaderboardEntry';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, StatCardComponent],
  template: `
    <div class="max-w-6xl mx-auto space-y-8">
      @switch (userRole) {
        @case ('admin') {
          <div class="glass-card p-8 rounded-3xl relative overflow-hidden">
            <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-2">
              Panel de Administración
            </h1>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
              Visión general y estadísticas del ecosistema Yonna Akademia
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <app-stat-card icon="users" label="Usuarios Totales" [value]="adminStats().totalUsers ?? '—'" />
              <app-stat-card icon="book" label="Cursos Totales" [value]="adminStats().totalCourses ?? '—'" />
              <app-stat-card icon="zap" label="Inscripciones" [value]="adminStats().totalEnrollments ?? '—'" />
            </div>

            <div class="flex flex-wrap gap-4">
              <button class="bg-brand-green hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-brand-green/20">
                Gestionar Usuarios
              </button>
              <button class="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-brand-orange/20">
                Gestionar Cursos
              </button>
            </div>
          </div>

          @if (leaderboardEntries().length > 0) {
            <div class="glass-card p-8 rounded-3xl">
              <h2 class="text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                <lucide-icon name="trophy" class="w-5 h-5 text-brand-orange"></lucide-icon>
                <span>Clasificación Global</span>
              </h2>
              <div class="space-y-2.5">
                @for (entry of leaderboardEntries(); track entry.user_id; let i = $index) {
                  <div class="flex items-center gap-4 p-3.5 rounded-2xl transition-all"
                       [class.bg-brand-orange/10]="i === 0"
                       [class.border]="i === 0"
                       [class.border-brand-orange/20]="i === 0"
                       [class.hover:bg-zinc-100/70]="i !== 0"
                       [class.dark:hover:bg-zinc-800/60]="i !== 0">
                    <div class="w-7 h-7 flex items-center justify-center rounded-xl font-bold text-xs"
                         [class]="i === 0 ? 'bg-brand-orange text-white' : i === 1 ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200' : i === 2 ? 'bg-amber-700/20 text-amber-700 dark:text-amber-400' : 'text-zinc-400 dark:text-zinc-500'">
                      {{ entry.rank }}
                    </div>
                    <div class="w-9 h-9 rounded-xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center">
                      <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-sm text-zinc-900 dark:text-white truncate">{{ entry.username }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-sm text-zinc-900 dark:text-white">{{ entry.total_xp }}</p>
                      <p class="text-[11px] text-zinc-400">XP</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

        @case ('moderator') {
          <div class="glass-card p-8 rounded-3xl">
            <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-2">
              Panel de Moderación
            </h1>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
              Revisión de contenidos y reportes comunitarios
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <app-stat-card icon="flag" label="Reportes Pendientes" value="8" />
              <app-stat-card icon="clock" label="Contenido por Revisar" value="12" />
            </div>
            <button class="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
              Ver Reportes
            </button>
          </div>
        }

        @default {
          <!-- User Metrics Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-stat-card icon="award" label="Nivel Actual" [value]="user?.level || 1" />
            <app-stat-card icon="zap" label="Progreso de Experiencia" [value]="(user?.xp || 0) + ' XP'" [progress]="getXpProgress()" />
          </div>

          <!-- Welcome Banner Card -->
          <div class="glass-card p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div class="flex-1 z-10">
              <span class="text-xs font-bold uppercase tracking-wider text-brand-green dark:text-emerald-400 mb-2 block">
                Plataforma de Aprendizaje
              </span>
              <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-3">
                ¡Bienvenido, <span class="text-brand-orange">{{ userName }}</span>!
              </h1>
              <p class="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Continúa con tus módulos de Wayuunaiki, refuerza tu vocabulario diario y compite en la tabla de clasificación.
              </p>
              <div class="flex flex-wrap gap-4">
                <button routerLink="/cursos" class="bg-brand-green hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-brand-green/20">
                  Explorar Cursos
                </button>
                <button routerLink="/diccionario" class="glass-panel text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all">
                  Consultar Diccionario
                </button>
              </div>
            </div>

            <div class="w-40 h-40 md:w-52 md:h-52 flex-shrink-0 z-10 relative">
              <img 
                [src]="mascotImage" 
                alt="Mascota Yonna" 
                class="w-full h-full object-contain drop-shadow-xl"
                onerror="this.src='assets/mascot/saludo.png';"
              />
            </div>

            <!-- Subtle background ambient accents -->
            <div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-orange/5 blur-3xl -z-0"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-green/5 blur-3xl -z-0"></div>
          </div>

          <!-- Global Leaderboard -->
          @if (leaderboardEntries().length > 0) {
            <div class="glass-card p-8 rounded-3xl">
              <h2 class="text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                <lucide-icon name="trophy" class="w-5 h-5 text-brand-orange"></lucide-icon>
                <span>Tabla de Clasificación</span>
              </h2>
              <div class="space-y-2.5">
                @for (entry of leaderboardEntries(); track entry.user_id; let i = $index) {
                  <div class="flex items-center gap-4 p-3.5 rounded-2xl transition-all"
                       [class.bg-brand-orange/10]="i === 0"
                       [class.border]="i === 0"
                       [class.border-brand-orange/20]="i === 0"
                       [class.hover:bg-zinc-100/70]="i !== 0"
                       [class.dark:hover:bg-zinc-800/60]="i !== 0">
                    <div class="w-7 h-7 flex items-center justify-center rounded-xl font-bold text-xs"
                         [class]="i === 0 ? 'bg-brand-orange text-white' : i === 1 ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200' : i === 2 ? 'bg-amber-700/20 text-amber-700 dark:text-amber-400' : 'text-zinc-400 dark:text-zinc-500'">
                      {{ entry.rank }}
                    </div>
                    <div class="w-9 h-9 rounded-xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center">
                      <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-sm text-zinc-900 dark:text-white truncate">{{ entry.username }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-sm text-zinc-900 dark:text-white">{{ entry.total_xp }}</p>
                      <p class="text-[11px] text-zinc-400">XP</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }
      }
    </div>
  `
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
