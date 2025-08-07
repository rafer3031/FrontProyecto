import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../shared/auth/auth.service';
import { DataAccessService } from '../../../shared/services/data.access.service';
import { firstValueFrom } from 'rxjs';
import { CompleteInfo } from '../forms/complete-info/complete-info';

export const userGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const dataAccessService = inject(DataAccessService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  try {

    const session = await authService.getSession();
    if (!session) {
      return router.parseUrl('/login');
    }

    const role = await authService.getUserRole(session.user.id);
    if (!role || role === null || role === undefined) {
      return router.parseUrl('/role-setup');
    }

    const isInfoComplete = await dataAccessService.checkUserInfoComplete();

    if (!isInfoComplete) {
      console.log('Información de usuario incompleta, abriendo dialog...');
      const dialogRef = dialog.open(CompleteInfo, {
        disableClose: true,
        width: '90%',
        maxWidth: '600px',
        panelClass: 'complete-info-dialog'
      });

      try {
        const result = await firstValueFrom(dialogRef.afterClosed());

        if (result?.success) {
          console.log('Información completada exitosamente');
          return true;
        } else {
          console.log('Dialog cerrado sin completar información');
          return router.parseUrl('/login');
        }
      } catch (error) {
        console.error('Error en el dialog:', error);
        return router.parseUrl('/login');
      }
    }
    return role === 2 && isInfoComplete ? true : router.parseUrl('/login');

  } catch (error) {
    console.error('Error en el guard:', error);
    return router.parseUrl('/login');
  }
};
