import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../../login/services/supabase.service';

export const loginGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  try {
    const session = await supabase.getSession();
    if (session) {
      return router.parseUrl('/dashboard');
    } else {
      return true;
    }
  } catch (error) {
    return router.parseUrl('/login');
  }
};
