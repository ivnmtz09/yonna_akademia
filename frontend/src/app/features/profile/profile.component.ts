import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <!-- Breadcrumb & Back -->
      <div class="flex items-center justify-between">
        <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
          <span>Volver al Dashboard</span>
        </a>

        <div class="flex items-center gap-2">
          @if (!isEditing()) {
            <button 
              type="button" 
              (click)="startEditing()"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-brand-green hover:bg-emerald-800 text-white shadow-md shadow-brand-green/20 transition-all">
              <lucide-icon name="pencil" class="w-3.5 h-3.5"></lucide-icon>
              <span>Editar Perfil</span>
            </button>
          } @else {
            <button 
              type="button" 
              (click)="cancelEditing()"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl glass-panel text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all">
              <span>Cancelar</span>
            </button>
          }
        </div>
      </div>

      <!-- Success & Error Banners -->
      @if (successMessage()) {
        <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
          <lucide-icon name="circle-check" class="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400"></lucide-icon>
          <span class="text-sm font-medium">{{ successMessage() }}</span>
        </div>
      }

      @if (errorMessage()) {
        <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 flex items-center gap-3">
          <lucide-icon name="circle-alert" class="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400"></lucide-icon>
          <span class="text-sm font-medium">{{ errorMessage() }}</span>
        </div>
      }

      <!-- Main Profile Header Card -->
      <div class="glass-card p-8 rounded-3xl relative overflow-hidden">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <!-- Avatar Badge -->
          <div class="relative group">
            <div class="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-green to-emerald-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-brand-green/20">
              {{ avatarInitials }}
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow">
              <lucide-icon [name]="roleIcon" class="w-4 h-4" [class]="roleColorClass"></lucide-icon>
            </div>
          </div>

          <!-- User Details -->
          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 class="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 dark:text-white">
                {{ userDisplayName }}
              </h1>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    [class]="roleBadgeClass">
                <lucide-icon [name]="roleIcon" class="w-3.5 h-3.5"></lucide-icon>
                <span>{{ roleLabel }}</span>
              </span>
            </div>

            <p class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center sm:justify-start gap-2 mb-4">
              <lucide-icon name="mail" class="w-4 h-4"></lucide-icon>
              <span>{{ user?.email }}</span>
            </p>

            @if (user?.bio) {
              <p class="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 max-w-xl">
                {{ user.bio }}
              </p>
            } @else {
              <p class="text-sm text-zinc-400 italic mb-4">
                Sin biografía corta registrada.
              </p>
            }

            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              @if (user?.profile?.localidad) {
                <span class="inline-flex items-center gap-1.5">
                  <lucide-icon name="map-pin" class="w-3.5 h-3.5"></lucide-icon>
                  <span>{{ user.profile.localidad }}</span>
                </span>
              }
              @if (user?.profile?.telefono) {
                <span class="inline-flex items-center gap-1.5">
                  <lucide-icon name="phone" class="w-3.5 h-3.5"></lucide-icon>
                  <span>{{ user.profile.telefono }}</span>
                </span>
              }
              @if (user?.date_joined) {
                <span class="inline-flex items-center gap-1.5">
                  <lucide-icon name="calendar" class="w-3.5 h-3.5"></lucide-icon>
                  <span>Miembro desde {{ user.date_joined | date:'longDate' }}</span>
                </span>
              }
            </div>
          </div>
        </div>

        <!-- Ambient Glow Accents -->
        <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-green/10 blur-3xl -z-0"></div>
        <div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-brand-orange/10 blur-3xl -z-0"></div>
      </div>

      <!-- Gamification & Progress Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Level Card -->
        <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Rango de Aprendizaje</span>
              <div class="w-9 h-9 rounded-xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 flex items-center justify-center">
                <lucide-icon name="award" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <h3 class="text-3xl font-display font-extrabold text-zinc-900 dark:text-white mb-1">
              Nivel {{ user?.level || 1 }}
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              {{ levelRankTitle }}
            </p>
          </div>

          <div class="mt-6">
            <div class="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span>Progreso al Nivel {{ (user?.level || 1) + 1 }}</span>
              <span class="font-semibold">{{ getXpProgress() | number:'1.0-0' }}%</span>
            </div>
            <div class="w-full bg-zinc-200/80 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div class="bg-gradient-to-r from-brand-green to-emerald-500 h-full rounded-full transition-all duration-500"
                   [style.width.%]="getXpProgress()"></div>
            </div>
          </div>
        </div>

        <!-- Experience Card -->
        <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Experiencia Acumulada</span>
              <div class="w-9 h-9 rounded-xl bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange flex items-center justify-center">
                <lucide-icon name="zap" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <h3 class="text-3xl font-display font-extrabold text-zinc-900 dark:text-white mb-1">
              {{ user?.xp || 0 }} <span class="text-base font-normal text-zinc-400">XP</span>
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Puntos obtenidos completando lecciones y evaluaciones
            </p>
          </div>

          <div class="mt-6 p-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
            <lucide-icon name="sparkles" class="w-4 h-4 text-brand-orange flex-shrink-0"></lucide-icon>
            <span>+10 XP por cada lección terminada</span>
          </div>
        </div>

        <!-- Streak Card -->
        <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Racha Activa</span>
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <lucide-icon name="flame" class="w-5 h-5"></lucide-icon>
              </div>
            </div>
            <h3 class="text-3xl font-display font-extrabold text-zinc-900 dark:text-white mb-1">
              1 Día
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Mantén el hábito diario de estudiar Wayuunaiki
            </p>
          </div>

          <div class="mt-6 p-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
            <lucide-icon name="shield-check" class="w-4 h-4 text-brand-green dark:text-emerald-400 flex-shrink-0"></lucide-icon>
            <span>Racha protegida hoy</span>
          </div>
        </div>
      </div>

      <!-- Editable Profile Form / Detailed Information -->
      <div class="glass-card p-8 rounded-3xl">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/80">
          <div>
            <h2 class="text-xl font-display font-bold text-zinc-900 dark:text-white">
              Información Personal
            </h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Datos registrados en tu cuenta y visibles en la comunidad
            </p>
          </div>

          @if (!isEditing()) {
            <button 
              type="button" 
              (click)="startEditing()"
              class="text-xs font-semibold text-brand-green dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5">
              <lucide-icon name="pencil" class="w-3.5 h-3.5"></lucide-icon>
              <span>Editar</span>
            </button>
          }
        </div>

        @if (isEditing()) {
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Nombre
                </label>
                <input 
                  type="text" 
                  formControlName="first_name" 
                  placeholder="Tu nombre"
                  class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Apellido
                </label>
                <input 
                  type="text" 
                  formControlName="last_name" 
                  placeholder="Tu apellido"
                  class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Teléfono
                </label>
                <input 
                  type="text" 
                  formControlName="telefono" 
                  placeholder="+57 300 000 0000"
                  class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Ciudad / Localidad
                </label>
                <input 
                  type="text" 
                  formControlName="localidad" 
                  placeholder="Ej. Uribia, La Guajira"
                  class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Biografía / Sobre Mí
              </label>
              <textarea 
                rows="3" 
                formControlName="bio" 
                placeholder="Cuéntanos sobre tu interés en el idioma y cultura Wayuu..."
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green text-sm resize-none"></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/60">
              <button 
                type="button" 
                (click)="cancelEditing()"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold glass-panel text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all">
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="isSaving()"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-green hover:bg-emerald-800 text-white shadow-md shadow-brand-green/20 transition-all disabled:opacity-50">
                @if (isSaving()) {
                  <lucide-icon name="loader-circle" class="w-4 h-4 animate-spin"></lucide-icon>
                  <span>Guardando...</span>
                } @else {
                  <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
                  <span>Guardar Cambios</span>
                }
              </button>
            </div>
          </form>
        } @else {
          <!-- Read-only View -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <span class="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Nombre Completo</span>
              <p class="text-sm font-semibold text-zinc-900 dark:text-white">
                {{ userFullName || 'No especificado' }}
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <span class="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Nombre de Usuario</span>
              <p class="text-sm font-semibold text-zinc-900 dark:text-white">
                {{ user?.username || 'No especificado' }}
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <span class="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Correo Electrónico</span>
              <p class="text-sm font-semibold text-zinc-900 dark:text-white">
                {{ user?.email }}
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <span class="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Teléfono de Contacto</span>
              <p class="text-sm font-semibold text-zinc-900 dark:text-white">
                {{ user?.profile?.telefono || 'No especificado' }}
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <span class="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Ubicación / Territorio</span>
              <p class="text-sm font-semibold text-zinc-900 dark:text-white">
                {{ user?.profile?.localidad || 'No especificado' }}
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <span class="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Rol en el Ecosistema</span>
              <p class="text-sm font-semibold text-zinc-900 dark:text-white">
                {{ roleLabel }}
              </p>
            </div>
          </div>
        }
      </div>

      <!-- Quick Navigation & Session Controls -->
      <div class="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
            <lucide-icon name="shield-check" class="w-5 h-5 text-brand-green dark:text-emerald-400"></lucide-icon>
          </div>
          <div>
            <h4 class="text-sm font-bold text-zinc-900 dark:text-white">Seguridad de la Sesión</h4>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Tu cuenta está protegida mediante autenticación segura JWT.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <a routerLink="/cursos" class="px-4 py-2 rounded-xl text-xs font-semibold glass-panel text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all">
            Ir a Cursos
          </a>
          <button 
            type="button" 
            (click)="logout()"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-red-200/60 dark:border-red-900/40">
            <lucide-icon name="log-out" class="w-3.5 h-3.5"></lucide-icon>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isEditing = signal(false);
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  profileForm: FormGroup = this.fb.group({
    first_name: [''],
    last_name: [''],
    bio: [''],
    telefono: [''],
    localidad: ['']
  });

  get user() {
    return this.authService.currentUser();
  }

  get userDisplayName(): string {
    const u = this.user;
    if (!u) return 'Estudiante';
    if (u.first_name) {
      return `${u.first_name} ${u.last_name || ''}`.trim();
    }
    return u.username || 'Estudiante';
  }

  get userFullName(): string {
    const u = this.user;
    if (!u) return '';
    if (u.first_name || u.last_name) {
      return `${u.first_name || ''} ${u.last_name || ''}`.trim();
    }
    return u.username || '';
  }

  get avatarInitials(): string {
    const name = this.userDisplayName.trim();
    if (!name) return 'Y';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get roleLabel(): string {
    const role = this.user?.role;
    if (role === 'admin') return 'Administrador';
    if (role === 'moderator') return 'Sabedor Wayuu / Docente';
    return 'Estudiante';
  }

  get roleIcon(): string {
    const role = this.user?.role;
    if (role === 'admin') return 'shield-check';
    if (role === 'moderator') return 'award';
    return 'graduation-cap';
  }

  get roleColorClass(): string {
    const role = this.user?.role;
    if (role === 'admin') return 'text-brand-orange';
    if (role === 'moderator') return 'text-emerald-500';
    return 'text-brand-green';
  }

  get roleBadgeClass(): string {
    const role = this.user?.role;
    if (role === 'admin') return 'bg-brand-orange/15 text-brand-orange border border-brand-orange/20';
    if (role === 'moderator') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    return 'bg-brand-green/15 text-brand-green dark:text-emerald-400 border border-brand-green/20';
  }

  get levelRankTitle(): string {
    const level = this.user?.level || 1;
    if (level >= 6) return 'Sabedor Avanzado';
    if (level >= 4) return 'Guardián del Léxico';
    if (level >= 2) return 'Explorador Cultural';
    return 'Iniciado en Wayuunaiki';
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
    this.populateForm();
    this.authService.fetchProfile().subscribe({
      next: () => this.populateForm(),
      error: () => {}
    });
  }

  populateForm(): void {
    const u = this.user;
    if (u) {
      this.profileForm.patchValue({
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        bio: u.bio || '',
        telefono: u.profile?.telefono || '',
        localidad: u.profile?.localidad || ''
      });
    }
  }

  startEditing(): void {
    this.populateForm();
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.populateForm();
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const formValues = this.profileForm.value;
    this.authService.updateProfile(formValues).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.successMessage.set('Tu perfil ha sido actualizado con éxito.');
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.message || 'Error al guardar los cambios en el perfil.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
