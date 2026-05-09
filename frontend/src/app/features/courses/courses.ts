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
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-3 mb-8">
          <div class="p-3 bg-brand-orange/10 dark:bg-brand-orange/20 rounded-xl">
            <lucide-icon name="graduation-cap" class="w-8 h-8 text-brand-orange"></lucide-icon>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Cursos Disponibles
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Aprende Wayuunaiki a tu propio ritmo
            </p>
          </div>
        </div>

        <!-- Loading -->
        @if (loading()) {
          <div class="text-center py-20">
            <lucide-icon name="loader-circle" class="w-12 h-12 text-brand-orange animate-spin mx-auto mb-4"></lucide-icon>
            <p class="text-gray-500 dark:text-gray-400">Cargando cursos...</p>
          </div>
        }

        <!-- Error -->
        @if (error(); as errorMsg) {
          <div class="text-center py-20">
            <lucide-icon name="alert-triangle" class="w-20 h-20 text-red-400 mx-auto mb-4"></lucide-icon>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al cargar</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ errorMsg }}</p>
          </div>
        }

        <!-- Course Grid -->
        @if (!loading() && !error()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of courses(); track course.id) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 
                          hover:border-brand-orange/50 dark:hover:border-brand-orange/50 
                          hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div class="h-48 bg-gradient-to-br from-brand-orange/20 to-brand-green/20 dark:from-brand-orange/30 dark:to-brand-green/30 
                            flex items-center justify-center relative overflow-hidden">
                  <lucide-icon [name]="course.icon" class="w-20 h-20 text-brand-orange/60 dark:text-brand-orange/50 
                                                        group-hover:scale-110 transition-transform"></lucide-icon>
                  @if (course.isEnrolled) {
                    <div class="absolute top-3 right-3 bg-brand-green text-white text-xs font-bold px-2 py-1 rounded-full">
                      Inscrito
                    </div>
                  }
                </div>
                <div class="p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="px-3 py-1 bg-brand-light-green dark:bg-brand-green/20 text-brand-green 
                                 text-sm font-medium rounded-full">
                      {{ course.level }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ course.duration }}</span>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ course.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {{ course.description }}
                  </p>
                  @if (course.isEnrolled) {
                    <div class="mb-4">
                      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progreso</span>
                        <span>{{ course.progress }}%</span>
                      </div>
                      <div class="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-brand-green rounded-full transition-all duration-500"
                             [style.width.%]="course.progress"></div>
                      </div>
                    </div>
                    <button class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-all">
                      Continuar
                    </button>
                  } @else {
                    <button 
                      class="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-all">
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
          <div class="text-center py-20">
            <lucide-icon name="book-x" class="w-20 h-20 text-gray-300 dark:text-slate-600 mx-auto mb-4"></lucide-icon>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No hay cursos disponibles
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Actualmente no hay cursos disponibles para tu nivel
            </p>
          </div>
        }
      </div>
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
    intermediate: 'library',
    advanced: 'message-circle',
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
