import { Component, signal, computed, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { VocabularioService } from '../../api/api/vocabulario.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface DictionaryEntry {
  wayuu: string;
  spanish: string;
  category?: string;
}

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-brand-green/10 dark:bg-brand-green/20 border border-brand-green/20 flex items-center justify-center text-brand-green dark:text-emerald-400 shadow-sm">
            <lucide-icon name="book-open" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Diccionario Wayuu - Español
            </h1>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Vocabulario, traducción fonética y categorías lingüísticas
            </p>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-96">
          <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"></lucide-icon>
          <input
            type="text"
            placeholder="Buscar en Wayuu o Español..."
            class="glass-input pl-11 pr-4 py-3 rounded-2xl w-full text-sm"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
          />
        </div>
      </div>

      <!-- Results Counter -->
      @if (entries().length > 0 && filteredEntries().length > 0) {
        <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          <span>{{ filteredEntries().length }} término{{ filteredEntries().length !== 1 ? 's' : '' }}</span>
          @if (searchTerm()) {
            <span>Filtrado por: "{{ searchTerm() }}"</span>
          }
        </div>
      }

      <!-- Loading State -->
      @if (loading()) {
        <div class="text-center py-20">
          <lucide-icon name="loader-circle" class="w-10 h-10 text-brand-green animate-spin mx-auto mb-3"></lucide-icon>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Cargando diccionario...</p>
        </div>
      }

      <!-- Error State -->
      @if (error(); as errorMsg) {
        <div class="glass-card max-w-lg mx-auto text-center p-8 rounded-3xl">
          <lucide-icon name="alert-triangle" class="w-12 h-12 text-amber-500 mx-auto mb-3"></lucide-icon>
          <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-2">No se pudo cargar el vocabulario</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ errorMsg }}</p>
        </div>
      }

      <!-- Dictionary Grid -->
      @if (!loading() && !error() && filteredEntries().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          @for (entry of filteredEntries(); track entry.wayuu) {
            <div class="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h3 class="text-xl font-display font-bold text-brand-green dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">
                    {{ entry.wayuu }}
                  </h3>
                  <button 
                    type="button" 
                    class="p-1.5 rounded-lg text-zinc-400 hover:text-brand-green hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title="Pronunciación">
                    <lucide-icon name="volume-2" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
                <p class="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  {{ entry.spanish }}
                </p>
              </div>

              @if (entry.category) {
                <div class="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/60">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-light-green/80 dark:bg-brand-green/20 text-brand-green dark:text-emerald-300 border border-brand-green/10">
                    {{ entry.category }}
                  </span>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Empty after search -->
      @if (!loading() && !error() && entries().length > 0 && filteredEntries().length === 0) {
        <div class="glass-card max-w-md mx-auto text-center py-16 px-6 rounded-3xl">
          <lucide-icon name="search-x" class="w-14 h-14 text-zinc-300 dark:text-zinc-600 mx-auto mb-3"></lucide-icon>
          <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-1.5">
            Sin coincidencias
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            No encontramos palabras que coincidan con "{{ searchTerm() }}"
          </p>
        </div>
      }

      <!-- Empty from API -->
      @if (!loading() && !error() && entries().length === 0) {
        <div class="glass-card max-w-md mx-auto text-center py-16 px-6 rounded-3xl">
          <lucide-icon name="book-x" class="w-14 h-14 text-zinc-300 dark:text-zinc-600 mx-auto mb-3"></lucide-icon>
          <h3 class="text-xl font-display font-bold text-zinc-900 dark:text-white mb-1.5">
            Diccionario en preparación
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Estamos indexando nuevas entradas de vocabulario.
          </p>
        </div>
      }
    </div>
  `,
})
export class DictionaryComponent {
  private vocabularioService = inject(VocabularioService);
  private destroyRef = inject(DestroyRef);

  searchTerm = signal('');
  entries = signal<DictionaryEntry[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.vocabularioService.vocabularyEntriesList().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.entries.set(response.results.map(e => ({
          wayuu: e.wayuunaiki_translation,
          spanish: e.spanish_term,
          category: e.category?.name,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar el diccionario. Verifica tu conexión e intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  filteredEntries = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allEntries = this.entries();
    if (!term) return allEntries;

    return allEntries.filter(
      (entry) =>
        entry.wayuu.toLowerCase().includes(term) ||
        entry.spanish.toLowerCase().includes(term)
    );
  });
}
