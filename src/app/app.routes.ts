import { Routes } from '@angular/router';


export const routes: Routes = [{
    path: 'login',
    loadComponent: () => import('./login/pages/login/login')
},
{
  path: 'register',
  loadComponent: () => import('./login/components/register-card/register-card')
}
];
