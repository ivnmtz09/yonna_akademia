import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { UiService } from '../../core/services/ui.service';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { GamificacinService } from '../../api/api/gamificacin.service';
import { CursosService } from '../../api/api/cursos.service';
import { HttpClient } from '@angular/common/http';
import { BASE_PATH } from '../../api';
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
          <!-- Admin Dashboard View -->
          <div class="glass-card p-8 rounded-3xl relative overflow-hidden">
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange/15 text-brand-orange border border-brand-orange/20">
                <lucide-icon name="shield-check" class="w-3.5 h-3.5"></lucide-icon>
                <span>Administrador del Sistema</span>
              </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-2">
              Panel de Gobernanza y Analítica
            </h1>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-2xl">
              Supervisión general, métricas de plataforma, control de usuarios y catálogo educativo de Yonna Akademia.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <app-stat-card icon="users" label="Usuarios Registrados" [value]="adminStats().totalUsers ?? '—'" />
              <app-stat-card icon="book" label="Cursos Disponibles" [value]="adminStats().totalCourses ?? '—'" />
              <app-stat-card icon="zap" label="Inscripciones Activas" [value]="adminStats().totalEnrollments ?? '—'" />
            </div>

            <div class="flex flex-wrap gap-4">
              <a routerLink="/cursos" class="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-brand-green/20">
                <lucide-icon name="graduation-cap" class="w-4 h-4"></lucide-icon>
                <span>Explorar Cursos</span>
              </a>
              <a routerLink="/dashboard/perfil" class="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-brand-orange/20">
                <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
                <span>Mi Perfil de Admin</span>
              </a>
              <a routerLink="/diccionario" class="inline-flex items-center gap-2 glass-panel text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
                <lucide-icon name="book-open" class="w-4 h-4"></lucide-icon>
                <span>Vocabulario</span>
              </a>
            </div>
          </div>

          <!-- Leaderboard for Admin -->
          @if ((leaderboardEntries() || []).length > 0) {
            <div class="glass-card p-8 rounded-3xl">
              <h2 class="text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                <lucide-icon name="trophy" class="w-5 h-5 text-brand-orange"></lucide-icon>
                <span>Tabla de Clasificación Global</span>
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
          <!-- Moderator Dashboard View (Sabedor Wayuu / Docente) -->
          <div class="glass-card p-8 rounded-3xl relative overflow-hidden">
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/15 text-brand-green dark:text-emerald-400 border border-brand-green/20">
                <lucide-icon name="award" class="w-3.5 h-3.5"></lucide-icon>
                <span>Sabedor Wayuu / Docente</span>
              </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-2">
              Panel Pedagógico y Cultural
            </h1>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-2xl">
              Supervisión de contenidos formativos, validación lingüística de Wayuunaiki y retroalimentación de la comunidad.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <app-stat-card icon="book" label="Catálogo de Cursos" [value]="adminStats().totalCourses ?? '—'" />
              <app-stat-card icon="zap" label="Estudiantes Activos" [value]="adminStats().totalEnrollments ?? '—'" />
              <app-stat-card icon="shield-check" label="Estado Pedagógico" value="Activo" />
            </div>

            <div class="flex flex-wrap gap-4">
              <a routerLink="/cursos" class="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-brand-green/20">
                <lucide-icon name="graduation-cap" class="w-4 h-4"></lucide-icon>
                <span>Supervisar Cursos</span>
              </a>
              <a routerLink="/diccionario" class="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-brand-orange/20">
                <lucide-icon name="book-open" class="w-4 h-4"></lucide-icon>
                <span>Validar Vocabulario</span>
              </a>
              <a routerLink="/dashboard/perfil" class="inline-flex items-center gap-2 glass-panel text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
                <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
                <span>Perfil Docente</span>
              </a>
            </div>
          </div>
        }

        @default {
          <!-- User / Student Dashboard View -->
          <!-- Metrics Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <app-stat-card icon="award" label="Nivel Actual" [value]="user?.level || 1" />
            <app-stat-card icon="zap" label="Experiencia Total" [value]="(user?.xp || 0) + ' XP'" [progress]="getXpProgress()" />
            <app-stat-card icon="flame" label="Racha de Aprendizaje" value="1 día" />
          </div>

          <!-- Welcome Banner Card -->
          <div class="glass-card p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div class="flex-1 z-10">
              <span class="text-xs font-bold uppercase tracking-wider text-brand-green dark:text-emerald-400 mb-2 block">
                Plataforma de Aprendizaje Interactivo
              </span>
              <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-3">
                ¡Bienvenido, <span class="text-brand-orange">{{ userName }}</span>!
              </h1>
              <p class="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Continúa con tus módulos de Wayuunaiki, refuerza tu vocabulario diario con pronunciaciones de audio y suma puntos de experiencia en cada desafío cultural.
              </p>
              <div class="flex flex-wrap gap-4">
                <a routerLink="/cursos" class="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-brand-green/20">
                  <lucide-icon name="graduation-cap" class="w-4 h-4"></lucide-icon>
                  <span>Mis Cursos</span>
                </a>
                <a routerLink="/diccionario" class="inline-flex items-center gap-2 glass-panel text-zinc-800 dark:text-zinc-200 hover:text-brand-green dark:hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all">
                  <lucide-icon name="book-open" class="w-4 h-4"></lucide-icon>
                  <span>Consultar Diccionario</span>
                </a>
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

          <!-- Quick Actions Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a routerLink="/cursos" class="glass-card p-6 rounded-3xl hover:border-brand-green/40 transition-all group flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <lucide-icon name="graduation-cap" class="w-6 h-6"></lucide-icon>
                </div>
                <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">Cursos Interactivos</h3>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Lecciones estructuradas sobre gramática, expresiones cotidianas y cultura ancestral Wayuu.
                </p>
              </div>
              <div class="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-green dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Continuar aprendiendo</span>
                <lucide-icon name="arrow-right" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </a>

            <a routerLink="/diccionario" class="glass-card p-6 rounded-3xl hover:border-brand-orange/40 transition-all group flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <lucide-icon name="book-open" class="w-6 h-6"></lucide-icon>
                </div>
                <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">Diccionario Wayuu</h3>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Cientos de términos traducidos con transcripción fonética y reproducción de audio nativo.
                </p>
              </div>
              <div class="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-orange group-hover:translate-x-1 transition-transform">
                <span>Practicar vocabulario</span>
                <lucide-icon name="arrow-right" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </a>

            <a routerLink="/dashboard/perfil" class="glass-card p-6 rounded-3xl hover:border-zinc-400/40 transition-all group flex flex-col justify-between">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <lucide-icon name="user" class="w-6 h-6"></lucide-icon>
                </div>
                <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">Mi Perfil y Logros</h3>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Consulta tu nivel de maestría, actualiza tus datos personales y revisa tus insignias ganadas.
                </p>
              </div>
              <div class="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:translate-x-1 transition-transform">
                <span>Ver mi perfil</span>
                <lucide-icon name="arrow-right" class="w-3.5 h-3.5"></lucide-icon>
              </div>
            </a>
          </div>

          <!-- Global Leaderboard for Student -->
          @if ((leaderboardEntries() || []).length > 0) {
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
  private http = inject(HttpClient);
  private basePath = inject(BASE_PATH);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  uiService = inject(UiService);

  leaderboardEntries = signal<LeaderboardEntry[]>([]);
  adminStats = signal<{ totalUsers?: number; totalCourses?: number; totalEnrollments?: number }>({});

  get user() {
    return this.authService.currentUser();
  }

  get userName(): string {
    const u = this.user;
    if (!u) return 'Estudiante';
    if (u.first_name) {
      return `${u.first_name} ${u.last_name || ''}`.trim();
    }
    return u.username || 'Estudiante';
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
    const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000];
    const currentMin = thresholds[level - 1] || 0;
    const nextMin = thresholds[level] || currentMin + 100;
    return Math.min(100, Math.max(0, ((xp - currentMin) / (nextMin - currentMin)) * 100));
  }

  ngOnInit(): void {
    this.loadLeaderboard();

    if (this.userRole === 'admin' || this.userRole === 'moderator') {
      this.loadAdminStats();
    }
  }

  private loadLeaderboard(): void {
    this.gamificacionService.gamificationLeaderboardList(10).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response: any) => {
        const items = Array.isArray(response) ? response : (response?.results || []);
        this.leaderboardEntries.set(items || []);
      },
      error: () => {
        this.leaderboardEntries.set([]);
      },
    });
  }

  private loadAdminStats(): void {
    this.cursosService.coursesStatisticsRetrieve().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response: any) => {
        this.adminStats.update(s => ({
          ...s,
          totalCourses: response.total_courses,
          totalEnrollments: response.total_enrollments,
        }));
      },
      error: () => {},
    });

    if (this.userRole === 'admin') {
      this.http.get<any>(`${this.basePath}/api/auth/users/`).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (res: any) => {
          const count = Array.isArray(res) ? res.length : (res?.count ?? (res?.results?.length || 0));
          this.adminStats.update(s => ({ ...s, totalUsers: count }));
        },
        error: () => {}
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
