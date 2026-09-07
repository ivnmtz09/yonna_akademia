import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 py-6">
      <!-- Breadcrumb & Back button -->
      <div>
        <a routerLink="/" class="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-green dark:hover:text-emerald-400 transition-colors font-medium">
          <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
          <span>Volver al Inicio</span>
        </a>
      </div>

      <!-- Page Header -->
      <div class="flex items-center gap-4 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/80">
        <div class="w-12 h-12 rounded-2xl bg-brand-orange/10 dark:bg-brand-orange/20 border border-brand-orange/20 flex items-center justify-center text-brand-orange shadow-sm flex-shrink-0">
          <lucide-icon name="shield-check" class="w-6 h-6"></lucide-icon>
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Política de Privacidad
          </h1>
          <p class="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Última actualización: Septiembre de 2026 · Tratamiento y Protección de Datos
          </p>
        </div>
      </div>

      <!-- Privacy Content Sections -->
      <div class="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
        <!-- Section 1 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
            1. Información que Recopilamos
          </h2>
          <p>
            En <strong>Yonna Akademia</strong> recopilamos únicamente los datos necesarios para brindar y personalizar la experiencia pedagógica:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Datos de cuenta:</strong> Nombre, apellido y dirección de correo electrónico facilitados en el registro.</li>
            <li><strong>Datos de autenticación con terceros:</strong> Identificador público, nombre y correo proporcionados por Google OAuth cuando optas por iniciar sesión con tu cuenta de Google. En ningún momento tenemos acceso a tus contraseñas externas.</li>
            <li><strong>Progreso educativo:</strong> Puntos de experiencia (XP), lecciones completadas, vocabulario consultado y logros desbloqueados.</li>
          </ul>
        </section>

        <!-- Section 2 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
            2. Finalidad del Tratamiento de Datos
          </h2>
          <p>
            Los datos recopilados se utilizan con las siguientes finalidades legítimas:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Autenticar tu identidad y mantener segura tu sesión en la plataforma.</li>
            <li>Registrar y sincronizar tu avance pedagógico a través de los módulos de Wayuunaiki.</li>
            <li>Generar las posiciones en la tabla de clasificación global comunitaria.</li>
            <li>Optimizar el rendimiento técnico de la aplicación y prevenir accesos no autorizados.</li>
          </ul>
        </section>

        <!-- Section 3 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
            3. Seguridad y Almacenamiento Cifrado
          </h2>
          <p>
            Implementamos protocolos de seguridad estándar en la industria, incluyendo transmisión segura bajo HTTPS, cifrado de tokens JWT para la gestión de sesión y resguardo de datos en bases de datos protegidas.
          </p>
          <p>
            Yonna Akademia no vende, alquila ni comparte información personal con anunciantes o terceros para fines comerciales.
          </p>
        </section>

        <!-- Section 4 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
            4. Almacenamiento Local (Local Storage)
          </h2>
          <p>
            Utilizamos el almacenamiento local del navegador para guardar de forma no intrusiva:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Tu preferencia de tema visual (Claro, Oscuro o Sistema).</li>
            <li>Tokens temporales de autenticación necesarios para mantener tu sesión activa.</li>
          </ul>
        </section>

        <!-- Section 5 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-orange"></span>
            5. Derechos del Usuario (Habeas Data)
          </h2>
          <p>
            En cualquier momento tienes derecho a conocer, actualizar, rectificar o solicitar la eliminación total de tus datos personales registrados en Yonna Akademia. Puedes ejercer estos derechos comunicándote con nuestro equipo a través de los canales institucionales.
          </p>
        </section>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
