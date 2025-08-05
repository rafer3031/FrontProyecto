import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DrawerService } from '../../../services/drawer.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../../../../shared/services/supabase.service';
import { AuthService } from '../../../../../../shared/auth/auth.service';
@Component({
  selector: 'tool-bar',
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.scss',
})
export class ToolBar {
  router = inject(Router);
  private drawerService = inject(DrawerService);
  private supabase = inject(SupabaseService);
  private authService = inject(AuthService);
  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }
  signOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
