import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-terms',
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
        <div class="w-12 h-12 rounded-2xl bg-brand-green/10 dark:bg-brand-green/20 border border-brand-green/20 flex items-center justify-center text-brand-green dark:text-emerald-400 shadow-sm flex-shrink-0">
          <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Términos y Condiciones
          </h1>
          <p class="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Última actualización: Septiembre de 2026 · Yonna Akademia
          </p>
        </div>
      </div>

      <!-- Legal Content Sections -->
      <div class="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
        <!-- Section 1 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-green"></span>
            1. Aceptación de los Términos
          </h2>
          <p>
            Al registrarte, navegar o interactuar con los recursos educativos de <strong>Yonna Akademia</strong>, aceptas someterte a estos Términos y Condiciones, así como a todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, te solicitamos abstenerte de utilizar la plataforma.
          </p>
        </section>

        <!-- Section 2 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-green"></span>
            2. Propósito y Respeto por el Patrimonio Cultural Wayuu
          </h2>
          <p>
            Yonna Akademia es una iniciativa pedagógica y comunitaria dedicada a la salvaguarda, enseñanza y difusión de la lengua Wayuunaiki y la memoria histórica del pueblo Wayuu. 
          </p>
          <p>
            Los usuarios se comprometen a interactuar con los contenidos lingüísticos, audios, narrativas orales y materiales culturales con el debido respeto a las autoridades ancestrales, los clanes y las tradiciones del pueblo indígena Wayuu.
          </p>
        </section>

        <!-- Section 3 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-green"></span>
            3. Registro y Cuentas de Usuario
          </h2>
          <p>
            Para acceder a las rutas de aprendizaje, cursos interactivos y métricas de progreso es necesario registrar una cuenta mediante correo electrónico o autenticación federada (Google OAuth).
          </p>
          <p>
            Eres responsable de custodiar tus credenciales de acceso y de cualquier actividad efectuada desde tu cuenta personal. Debes notificar de inmediato cualquier uso no autorizado de tu perfil.
          </p>
        </section>

        <!-- Section 4 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-green"></span>
            4. Propiedad Intelectual y Licenciamiento
          </h2>
          <p>
            El diseño gráfico, interfaces de usuario, arquitectura de software, marcas visuales y contenidos pedagógicos son propiedad de Yonna Akademia y sus colaboradores culturales. Se concede una licencia limitada, personal y no comercial para el estudio autónomo.
          </p>
          <p>
            Queda prohibida la reproducción masiva, extracción automatizada o redistribución comercial de los recursos sin autorización previa expresa.
          </p>
        </section>

        <!-- Section 5 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-green"></span>
            5. Normas de Convivencia Estudiantil
          </h2>
          <p>
            En los espacios comunitarios, tableros de clasificación y actividades colectivas, no se tolerarán conductas difamatorias, lenguaje de odio o discriminación hacia ninguna etnia, género o procedencia. Las cuentas que vulneren estas normas podrán ser suspendidas.
          </p>
        </section>

        <!-- Section 6 -->
        <section class="glass-card p-6 md:p-8 rounded-3xl space-y-3">
          <h2 class="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-brand-green"></span>
            6. Modificaciones de los Términos
          </h2>
          <p>
            Yonna Akademia se reserva la facultad de actualizar estos términos en cualquier momento para adaptarlos a nuevas funcionalidades pedagógicas o normativas legales. Cualquier cambio sustancial será notificado oportunamente en la plataforma.
          </p>
        </section>
      </div>
    </div>
  `
})
export class TermsComponent {}
