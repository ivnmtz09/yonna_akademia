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
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-8">
      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-brand-green/10 dark:bg-brand-green/20 rounded-xl">
            <lucide-icon name="book-open" class="w-8 h-8 text-brand-green"></lucide-icon>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Diccionario Wayuu-Español
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Explora el vocabulario de la lengua Wayuunaiki
            </p>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative max-w-2xl">
          <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></lucide-icon>
          <input
            type="text"
            placeholder="Buscar palabra en Wayuu o Español..."
            class="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green
                   transition-all text-lg"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
          />
        </div>

        <!-- Results counter -->
        @if (entries().length > 0 && filteredEntries().length > 0) {
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {{ filteredEntries().length }} palabra{{ filteredEntries().length !== 1 ? 's' : '' }} encontrada{{ filteredEntries().length !== 1 ? 's' : '' }}
          </p>
        }
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="max-w-7xl mx-auto text-center py-20">
          <lucide-icon name="loader-circle" class="w-12 h-12 text-brand-green animate-spin mx-auto mb-4"></lucide-icon>
          <p class="text-gray-500 dark:text-gray-400">Cargando diccionario...</p>
        </div>
      }

      <!-- Error State -->
      @if (error(); as errorMsg) {
        <div class="max-w-7xl mx-auto text-center py-20">
          <lucide-icon name="alert-triangle" class="w-20 h-20 text-red-400 mx-auto mb-4"></lucide-icon>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al cargar</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ errorMsg }}</p>
        </div>
      }

      <!-- Dictionary Grid -->
      @if (!loading() && !error() && filteredEntries().length > 0) {
        <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          @for (entry of filteredEntries(); track entry.wayuu) {
            <div class="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700
                        hover:border-brand-green/50 dark:hover:border-brand-green/50
                        hover:shadow-lg hover:shadow-brand-green/5
                        transition-all duration-300 cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-2xl font-bold text-brand-green dark:text-brand-green/90">
                  {{ entry.wayuu }}
                </h3>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <lucide-icon name="volume-2" class="w-5 h-5 text-gray-400 hover:text-brand-green"></lucide-icon>
                </span>
              </div>
              <p class="text-lg text-gray-900 dark:text-slate-100 font-medium">
                {{ entry.spanish }}
              </p>
              @if (entry.category) {
                <span class="inline-block mt-3 px-3 py-1 bg-brand-light-green dark:bg-brand-green/20
                             text-brand-green dark:text-brand-green/90 text-sm font-medium rounded-full">
                  {{ entry.category }}
                </span>
              }
            </div>
          }
        </div>
      }

      <!-- Empty after search -->
      @if (!loading() && !error() && entries().length > 0 && filteredEntries().length === 0) {
        <div class="max-w-7xl mx-auto text-center py-20">
          <lucide-icon name="search-x" class="w-20 h-20 text-gray-300 dark:text-slate-600 mx-auto mb-4"></lucide-icon>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No se encontraron resultados
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Intenta con otra palabra o término de búsqueda
          </p>
        </div>
      }

      <!-- Empty from API -->
      @if (!loading() && !error() && entries().length === 0) {
        <div class="max-w-7xl mx-auto text-center py-20">
          <lucide-icon name="book-x" class="w-20 h-20 text-gray-300 dark:text-slate-600 mx-auto mb-4"></lucide-icon>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No hay palabras disponibles
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            El diccionario está vacío actualmente
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
