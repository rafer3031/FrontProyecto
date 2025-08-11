import { Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DrawerService } from '../../../services/drawer.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../shared/auth/auth.service';
import { DialogLoading } from '../../../../../../shared/components/dialog-loading/dialog-loading';
import { DialogError } from '../../../../../../shared/components/dialog-error/dialog-error';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DataAccessService } from '../../../../../../shared/services/data.access.service';
@Component({
  selector: 'tool-bar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.scss',
})
export class ToolBar {
  router = inject(Router);
  private drawerService = inject(DrawerService);
  private dataAccessService = inject(DataAccessService);
  private authService = inject(AuthService);

  names = signal<string | undefined>('');
  async getName() {
    const response = await this.dataAccessService.getCurrentUser();
    this.names.set(response![0].nombres)
  }
  constructor() {
    this.getName()
  }
  dialog = inject(MatDialog);
  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }
  async signOut() {
    const loadingDialogRef = this.dialog.open(DialogLoading, {
      data: { message: 'Cerrando sesión' },
      width: '400px',
      disableClose: true,
      panelClass: 'loading-dialog',
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
