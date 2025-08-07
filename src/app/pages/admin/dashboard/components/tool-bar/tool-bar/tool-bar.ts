import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DrawerService } from '../../../services/drawer.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../../../../shared/services/supabase.service';
import { AuthService } from '../../../../../../shared/auth/auth.service';
import { DialogLoading } from '../../../../../../shared/components/dialog-loading/dialog-loading';
import { DialogError } from '../../../../../../shared/components/dialog-error/dialog-error';
import { MatDialog } from '@angular/material/dialog';
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
  dialog = inject(MatDialog);
  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }
  async signOut() {
      const loadingDialogRef = this.dialog.open(DialogLoading, {
        data: { message: 'Cerrando sesión' },
        width: '400px',
        disableClose: true,
        panelClass: 'loading-dialog'
      });

      try {
        await this.authService.signOut();
        loadingDialogRef.close();
        this.router.navigate(['/login']);

      } catch (error) {
        loadingDialogRef.close();
         this.dialog.open(DialogError, {
          data: { message: 'Error al cerrar sesión. Intenta nuevamente.' },
         });
      }
    }
}
