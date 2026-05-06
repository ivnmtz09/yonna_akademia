import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <nav class="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
      <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
        <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-8 h-8 object-contain">
        <span class="text-2xl font-bold text-gray-900 tracking-tight">Yonna Akademia</span>
      </div>
      <div class="hidden md:flex items-center gap-2 bg-gray-50 rounded-full p-1 border border-gray-100">
        <a routerLink="/" class="flex items-center gap-2 px-5 py-2 bg-brand-light-green text-brand-green font-medium rounded-full transition-all">
          <lucide-icon name="home" class="w-5 h-5"></lucide-icon> Inicio
        </a>
        <a routerLink="/cultura" class="flex items-center gap-2 px-5 py-2 text-gray-500 font-medium hover:text-brand-green rounded-full transition-all">
          <lucide-icon name="book-open" class="w-5 h-5"></lucide-icon> Cultura Wayuu
        </a>
      </div>
      <div class="flex items-center gap-6">
        <lucide-icon name="smartphone" class="w-5 h-5 text-gray-400 hidden md:block"></lucide-icon>
        <button class="text-gray-900 font-semibold hover:text-brand-green transition-colors">Ingresar</button>
        <button class="bg-brand-green text-white font-semibold px-6 py-2.5 rounded-full hover:bg-opacity-90 transition-all shadow-md">
          Crear Cuenta
        </button>
      </div>
    </nav>
  `
})
export class Navbar {}
