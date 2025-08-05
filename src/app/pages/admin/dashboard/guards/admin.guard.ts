import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../../shared/auth/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const session = await authService.getSession();
    if (!session) {
      return router.parseUrl('/login');
    }

    const role = await authService.getUserRole(session.user.id);
    return role === 1 ? true : router.parseUrl('/login');
  } catch (error) {
    return router.parseUrl('/login');
  }
};
