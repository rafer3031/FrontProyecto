import { Routes } from '@angular/router';
import { loginGuard } from './pages/public/login/guards/login.guard';
import { adminGuard } from './pages/admin/dashboard/guards/admin.guard';
import { userGuard } from './pages/users/guards/user.guard';
import { driverGuard } from './pages/drivers/guards/driver.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],

    loadComponent: () => import('./pages/public/login/pages/login/login'),
  },
  {
    path: 'role-setup',

    loadComponent: () => import('./shared/components/role-setup/role.setup'),
  },
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () => import('./pages/admin/admin.routes'),
  },
  {
    path: 'users',
    canMatch: [userGuard],
    loadChildren: () => import('./pages/users/users.routes'),
  },
  {
    path: 'drivers',
    canMatch: [driverGuard],
    loadChildren: () => import('./pages/drivers/drivers.routes'),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
