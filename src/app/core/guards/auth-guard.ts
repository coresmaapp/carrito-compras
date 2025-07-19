import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const token = authService.accessToken;

  if (!token) {
    router.navigate(['/login']); // redirige si no hay token
    return of(false);
  }

  return of(true); // ✅ esto faltaba
};
