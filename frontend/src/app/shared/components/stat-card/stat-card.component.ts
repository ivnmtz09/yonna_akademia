import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="glass-card glass-card-hover rounded-2xl p-5">
      <div class="flex items-center gap-3.5 mb-3.5">
        <div class="w-11 h-11 rounded-xl bg-brand-light-green/90 dark:bg-brand-green/20 border border-brand-green/10 dark:border-emerald-500/20 flex items-center justify-center text-brand-green dark:text-emerald-400">
          <lucide-icon [name]="icon()" class="w-5 h-5"></lucide-icon>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{{ label() }}</p>
          <p class="text-2xl font-display font-extrabold text-zinc-900 dark:text-white mt-0.5">{{ value() }}</p>
        </div>
      </div>
      @if (progress() !== undefined) {
        <div class="w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-full h-2 overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
          <div class="bg-gradient-to-r from-brand-green to-emerald-500 h-2 rounded-full transition-all duration-500" [style.width.%]="progress()"></div>
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
