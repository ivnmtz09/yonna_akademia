import { Component, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { LucideAngularModule } from 'lucide-angular';
import { CursosService } from '../../api/api/cursos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface CourseDisplay {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  icon: string;
  isEnrolled: boolean;
  progress: number;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 border border-brand-orange/20 flex items-center justify-center text-brand-orange shadow-sm">
          <lucide-icon name="graduation-cap" class="w-6 h-6"></lucide-icon>
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Cursos Disponibles
          </h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Aprende Wayuunaiki estructurado por niveles y a tu propio ritmo
          </p>
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-20">
          <lucide-icon name="loader-circle" class="w-10 h-10 text-brand-orange animate-spin mx-auto mb-3"></lucide-icon>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Cargando cursos...</p>
        </div>
      }

      <!-- Error -->
      @if (error(); as errorMsg) {
        <div class="glass-card max-w-lg mx-auto text-center p-8 rounded-3xl">
          <lucide-icon name="alert-triangle" class="w-12 h-12 text-amber-500 mx-auto mb-3"></lucide-icon>
          <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-2">No se pudieron cargar los cursos</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ errorMsg }}</p>
        </div>
      }

      <!-- Course Grid -->
      @if (!loading() && !error()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (course of courses(); track course.id) {
            <div class="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col group">
              <div class="h-44 bg-gradient-to-br from-brand-orange/15 via-brand-green/10 to-transparent dark:from-brand-orange/20 dark:via-brand-green/15 flex items-center justify-center relative overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/60">
                <lucide-icon [name]="course.icon" class="w-16 h-16 text-brand-orange/70 dark:text-brand-orange/60 group-hover:scale-110 transition-transform duration-300"></lucide-icon>
                @if (course.isEnrolled) {
                  <div class="absolute top-3.5 right-3.5 bg-brand-green/90 dark:bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    Inscrito
                  </div>
                }
              </div>

              <div class="p-6 flex flex-col flex-1">
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-2.5 py-0.5 bg-brand-light-green/90 dark:bg-brand-green/20 text-brand-green dark:text-emerald-300 text-xs font-semibold rounded-full border border-brand-green/15">
                    {{ course.level }}
                  </span>
                  <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ course.duration }}</span>
                </div>

                <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-2">
                  {{ course.title }}
                </h3>

                <p class="text-zinc-600 dark:text-zinc-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {{ course.description }}
                </p>

                @if (course.isEnrolled) {
                  <div class="mb-4">
                    <div class="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">
                      <span>Progreso</span>
                      <span>{{ course.progress }}%</span>
                    </div>
                    <div class="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
                      <div class="h-full bg-brand-green rounded-full transition-all duration-500"
                           [style.width.%]="course.progress"></div>
                    </div>
                  </div>
                  <button class="w-full bg-brand-green hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-brand-green/20">
                    Continuar Curso
                  </button>
                } @else {
                  <button class="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-brand-orange/20">
                    Inscribirse
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Empty -->
      @if (!loading() && !error() && courses().length === 0) {
        <div class="glass-card max-w-md mx-auto text-center py-16 px-6 rounded-3xl">
          <lucide-icon name="book-x" class="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-3"></lucide-icon>
          <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-1.5">
            No hay cursos disponibles
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Pronto añadiremos nuevos módulos formativos a este nivel.
          </p>
        </div>
      }
    </div>
  `,
})
export class CoursesComponent {
  private cursosService = inject(CursosService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  courses = signal<CourseDisplay[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private difficultyLabels: Record<string, string> = {
    beginner: 'Básico',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };

  private difficultyIcons: Record<string, string> = {
    beginner: 'book-open',
    intermediate: 'book',
    advanced: 'award',
  };

  constructor() {
    if (!this.authService.isAuthenticated()) {
      this.error.set('Debes iniciar sesión para ver los cursos disponibles.');
      this.loading.set(false);
      return;
    }

    this.cursosService.coursesAvailableList().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.courses.set(response.results.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          level: this.difficultyLabels[c.difficulty ?? 'beginner'] || 'Básico',
          duration: c.estimated_duration ? `${c.estimated_duration} h` : 'Auto-ritmo',
          icon: this.difficultyIcons[c.difficulty ?? 'beginner'] || 'book-open',
          isEnrolled: c.is_enrolled,
          progress: Math.round(c.user_progress ?? 0),
        })));
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 401) {
          this.error.set('Tu sesión ha expirado. Inicia sesión nuevamente para ver los cursos.');
        } else {
          this.error.set('No pudimos cargar los cursos. Verifica tu conexión.');
        }
        this.loading.set(false);
      },
    });
  }
}
