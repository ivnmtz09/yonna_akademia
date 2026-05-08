import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { UiService } from '../services/ui.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const uiService = inject(UiService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Not authenticated, redirect to home and open login modal
  router.navigate(['/']);
  uiService.openLoginModal();
  return false;
};
