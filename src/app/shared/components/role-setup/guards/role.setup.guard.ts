import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleSetupGuard implements CanActivate {


  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const hasPendingRole = !!localStorage.getItem('pendingUserRole');

    if (hasPendingRole) {
      return true;
    }

    return this.router.parseUrl('/login');
  }
}
