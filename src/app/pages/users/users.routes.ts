import { Routes } from '@angular/router';
import { userGuard } from './guards/user.guard';
import { CompleteInfo } from './forms/complete-info/complete-info';

export const UsersRoutes: Routes = [
  {
    path: '',
    canActivate: [userGuard],
    loadComponent: () => import('./pages/user-info/user-info'),
    children:[{
      path: 'complete-info',
      component: CompleteInfo
    }]
  },
];
export default UsersRoutes;
