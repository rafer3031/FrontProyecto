import { Routes } from '@angular/router';
import Users from './dashboard/pages/users/users';
import DashboardPage from './dashboard/components/dashboard-page/dashboard-page-content/dashboard-page-content';
import { adminGuard } from './dashboard/guards/admin.guard';


export const AdminRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./dashboard/pages/dashboard/dashboard'),
    children: [
      {
        path: 'users',
        component: Users,
      },
      {
        path: '',
        component: DashboardPage,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
export default AdminRoutes;
