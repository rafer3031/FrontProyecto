import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../shared/auth/auth.service';
import { DataAccessService } from '../../../shared/services/data.access.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Dialog } from '../../../pages/public/login/components/dialog/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-role-setup',
  standalone: true,
  templateUrl: './role-setup.component.html',
  styleUrl: './role-setup.component.scss',
  imports: [MatProgressSpinnerModule, MatCardModule],
})
export default class RoleSetupComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private dataAccessService = inject(DataAccessService);
  private isProcessing = signal(false);

  async ngOnInit() {
    if (this.isProcessing()) return;

    this.isProcessing.set(true);

    try {
      const session = await this.authService.getSession();
      if (!session) {
        this.router.navigate(['/login']);
        return;
      }
      const pendingRole = localStorage.getItem('pendingUserRole');

      if (pendingRole) {
        await this.applyPendingRole(parseInt(pendingRole));
      } else {
        await this.openRoleDialog();
      }
    } catch (error) {
      console.error('Error en role setup:', error);
      this.router.navigate(['/login']);
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async applyPendingRole(roleId: number): Promise<void> {
    try {
      console.log('Aplicando rol pendiente:', roleId);
      await this.updateUserRole(roleId);
      localStorage.removeItem('pendingUserRole');
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.router.navigate(['/users']);
    } catch (error) {
      console.error('Error al aplicar rol pendiente:', error);
      await this.openRoleDialog();
    }
  }

  private async openRoleDialog(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(Dialog, {
        width: '400px',
        data: { message: 'Seleccione su función en la empresa para continuar' },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(async (selectedRole) => {
        if (selectedRole) {
          try {
            await this.updateUserRole(parseInt(selectedRole));
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.router.navigate(['/users']);
            resolve();
          } catch (error) {
            console.error('Error al actualizar rol:', error);
            reject(error);
          }
        } else {
          this.router.navigate(['/login']);
          reject(new Error('No se seleccionó rol'));
        }
      });
    });
  }

  private async updateUserRole(roleId: number): Promise<void> {
    try {
      await this.dataAccessService.updateRolUser({ id_rol: roleId });
      console.log('Rol actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      throw error;
    }
  }
}
