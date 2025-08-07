import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogLoading } from '../../../../shared/components/dialog-loading/dialog-loading';
import { DialogError } from '../../../../shared/components/dialog-error/dialog-error';

@Component({
  selector: 'app-driver-info',
  imports: [MatButtonModule],
  templateUrl: './driver-info.html',
  styleUrl: './driver-info.scss'
})
export default class DriverInfo {
  router = inject(Router);
  authService = inject(AuthService);
  dialog = inject(MatDialog);

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
