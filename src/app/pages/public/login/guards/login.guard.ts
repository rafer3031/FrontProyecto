import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../../shared/auth/auth.service';

export const loginGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = await authService.getSession();
  if (!session) return true;

  const role = await authService.getUserRole(session.user.id);

  if (role === 1) return router.parseUrl('/admin');
  if (role === 2) return router.parseUrl('/users');
  if (role === 3) return router.parseUrl('/drivers');

  return router.parseUrl('/login');
};
