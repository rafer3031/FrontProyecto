import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/pages/login/login'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard'),
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];
