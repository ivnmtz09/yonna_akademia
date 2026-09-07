import { Injectable, inject, signal } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationProgressService {
  private router = inject(Router);

  readonly isLoading = signal<boolean>(false);
  readonly progress = signal<number>(0);

  private timerIds: any[] = [];

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.handleNavigationStart();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.handleNavigationComplete();
      }
    });
  }

  private clearTimers(): void {
    this.timerIds.forEach((id) => clearTimeout(id));
    this.timerIds = [];
  }

  private handleNavigationStart(): void {
    this.clearTimers();
    this.isLoading.set(true);
    this.progress.set(15);

    this.timerIds.push(
      setTimeout(() => {
        if (this.isLoading()) {
          this.progress.set(40);
        }
      }, 100)
    );

    this.timerIds.push(
      setTimeout(() => {
        if (this.isLoading()) {
          this.progress.set(70);
        }
      }, 250)
    );

    this.timerIds.push(
      setTimeout(() => {
        if (this.isLoading()) {
          this.progress.set(88);
        }
      }, 450)
    );
  }

  private handleNavigationComplete(): void {
    this.clearTimers();
    this.progress.set(100);

    // Reseteo inmediato y seguro del scroll al tope
    this.scrollToTop();

    // Mantener la barra al 100% brevemente para una percepcion visual suave
    this.timerIds.push(
      setTimeout(() => {
        this.isLoading.set(false);
        this.timerIds.push(
          setTimeout(() => {
            this.progress.set(0);
          }, 200)
        );
      }, 250)
    );
  }

  private scrollToTop(): void {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } catch {
      window.scrollTo(0, 0);
    }
  }
}
