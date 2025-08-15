import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DialogLoading } from '../../../../shared/components/dialog-loading/dialog-loading';
import { DialogError } from '../../../../shared/components/dialog-error/dialog-error';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DataAccessService } from '../../../../shared/services/data.access.service';

@Component({
  selector: 'app-tool-bar',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.scss',
})
export class ToolBar {
  router = inject(Router);
  authService = inject(AuthService);
  private dataAccessService = inject(DataAccessService);
  dialog = inject(MatDialog);
  names = signal<string | undefined | null>('');
   constructor() {
    this.getName()
  }
  async getName() {
    const response = await this.dataAccessService.getCurrentUser();
    this.names.set(response![0].nombres);
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
