import { Routes } from '@angular/router';
import Users from './dashboard/pages/users/users';
import DashboardPage from './dashboard/components/dashboard-page/dashboard-page-content/dashboard-page-content';
import { adminGuard } from './dashboard/guards/admin.guard';
import { Drivers } from './dashboard/pages/drivers/drivers';
import { Admins } from './dashboard/pages/admins/admins';


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
        path: 'drivers',
        component: Drivers,
      },
       {
        path: 'admins',
        component: Admins,
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
