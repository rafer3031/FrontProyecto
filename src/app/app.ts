import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataAccessService } from './shared/services/data.access.service';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  router = inject(Router);
  authService = inject(AuthService);
  async ngOnInit(): Promise<void> {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/role-setup') {
        const session = await this.authService.getSession();
        if (session) {
          this.router.navigate(['/role-setup']);
        }
      }


      history.replaceState(null, '', window.location.pathname);
    }
  }
}
