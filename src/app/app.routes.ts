import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/pages/login/login'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/pages/dashboard/dashboard'),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/components/dashboard-page/dashboard-page-content/dashboard-page-content'),
      },
      {
        path: 'users',
        loadComponent: () => import('./dashboard/pages/users/users'),
      },
      {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
