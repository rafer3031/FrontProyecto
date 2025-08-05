import { Routes } from '@angular/router';
import { userGuard } from './guards/user.guard';

export const UsersRoutes: Routes = [
  {
    path: '',
    canActivate: [userGuard],
    loadComponent: () => import('./pages/user-info/user-info'),

  },
];
export default UsersRoutes;
