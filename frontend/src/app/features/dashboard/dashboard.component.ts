import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 md:h-screen">
        <div class="p-6 border-b border-gray-100 flex items-center gap-3 cursor-pointer" routerLink="/">
          <!-- Logo -->
          <img src="assets/brand/yonna.png" alt="Yonna Akademia Logo" class="w-8 h-8 object-contain">
          <span class="text-xl font-extrabold text-gray-900 tracking-tight">Akademia</span>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="layout-dashboard" class="w-5 h-5"></lucide-icon>
            Mi Dashboard
          </a>
          <a routerLink="/dashboard/cursos" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="book" class="w-5 h-5"></lucide-icon>
            Cursos
          </a>
          <a routerLink="/dashboard/diccionario" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="book-open" class="w-5 h-5"></lucide-icon>
            Diccionario
          </a>
          <a routerLink="/dashboard/logros" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="trophy" class="w-5 h-5"></lucide-icon>
            Logros
          </a>
          <a routerLink="/dashboard/perfil" routerLinkActive="bg-brand-green/10 text-brand-green font-semibold" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-brand-green rounded-xl font-medium transition-colors">
            <lucide-icon name="user" class="w-5 h-5"></lucide-icon>
            Perfil
          </a>
        </nav>

        <div class="p-4 border-t border-gray-100">
          <button 
            (click)="logout()" 
            class="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-colors"
          >
            <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="max-w-4xl mx-auto">
          <!-- Welcome Card -->
          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            
            <div class="flex-1 z-10">
              <h1 class="text-4xl font-extrabold text-gray-900 mb-4">
                ¡Bienvenido, <span class="text-brand-orange">{{ userName }}</span>!
              </h1>
              <p class="text-lg text-gray-600 mb-6">
                Estamos muy felices de verte aquí. Tu viaje de aprendizaje en Yonna Akademia acaba de comenzar.
                ¡Explora tus cursos, revisa tu progreso y diviértete aprendiendo!
              </p>
              <button routerLink="/dashboard/cursos" class="bg-brand-green text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20">
                Ver mis cursos
              </button>
            </div>
            
            <div class="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 z-10">
              <img 
                src="assets/mascot/welcome.png" 
                alt="Mascota de bienvenida" 
                class="w-full h-full object-cover rounded-2xl shadow-md border-4 border-white"
                onerror="this.src='https://placehold.co/400?text=Mascota+Yonna&bg=F97316&textColor=fff';"
              />
            </div>
            
            <!-- Decorative background elements -->
            <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand-orange/5 blur-3xl z-0"></div>
            <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-brand-green/5 blur-3xl z-0"></div>
          </div>
          
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName: string = 'Estudiante';

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && user.username) {
      this.userName = user.username;
    } else if (user && user.first_name) {
      this.userName = user.first_name;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
