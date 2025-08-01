import { Routes } from '@angular/router';
import { authGuard } from './dashboard/guards/auth-guard';
import { loginGuard } from './login/guards/login.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./login/pages/login/login'),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/pages/dashboard/dashboard'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './dashboard/components/dashboard-page/dashboard-page-content/dashboard-page-content'
          ),
      },
      {
        path: 'users',
        loadComponent: () => import('./dashboard/pages/users/users'),
      },
      {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
