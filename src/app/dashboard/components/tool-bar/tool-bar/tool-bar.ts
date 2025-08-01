import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DrawerService } from '../../../services/drawer.service';
import { SupabaseService } from '../../../../login/services/supabase.service';
import { Router } from '@angular/router';
@Component({
  selector: 'tool-bar',
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.scss',
})
export class ToolBar {
  router = inject(Router)
  private drawerService = inject(DrawerService);
  private supabase = inject(SupabaseService);
  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }
  async signOut() {
    await this.supabase.signOut();
     this.router.navigate(['/login']);
  }
}
