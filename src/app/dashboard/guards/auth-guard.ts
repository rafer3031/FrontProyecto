import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../../login/services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  try {
    const session = await supabase.getSession();
    if (session) {
      return true;
    } else {
      return router.parseUrl('/login');
    }
  } catch (error) {
    return router.parseUrl('/login');
  }
};
