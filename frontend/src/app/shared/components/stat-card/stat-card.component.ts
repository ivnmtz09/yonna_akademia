import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-xl bg-brand-light-green dark:bg-brand-green/20 flex items-center justify-center">
          <lucide-icon [name]="icon()" class="w-6 h-6 text-brand-green"></lucide-icon>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ label() }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value() }}</p>
        </div>
      </div>
      @if (progress() !== undefined) {
        <div class="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
          <div class="bg-brand-green h-2 rounded-full" [style.width.%]="progress()"></div>
        </div>
      }
    </div>
  `,
})
export class StatCardComponent {
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<string | number>();
  progress = input<number>();
}
