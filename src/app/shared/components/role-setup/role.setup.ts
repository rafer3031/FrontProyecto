import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import { DataAccessService } from '../../../shared/services/data.access.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  private authService = inject(AuthService);
  private dataAccessService = inject(DataAccessService);
  isProcessing = signal(false);

  async ngOnInit() {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);

    try {
      const session = await this.authService.getSession();
      if (!session) {
        this.router.navigate(['/login']);
        return;
      }

      // Rol fijo = 2
      const roleId = parseInt(localStorage.getItem('pendingUserRole') ?? '2', 10);

      await this.updateUserRole(roleId);

      localStorage.removeItem('pendingUserRole');
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.router.navigate(['/users']);
    } catch (error) {
      console.error('Error en role setup:', error);
      this.router.navigate(['/login']);
    } finally {
      this.isProcessing.set(false);
    }
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
