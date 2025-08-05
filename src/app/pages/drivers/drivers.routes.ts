import { Routes } from '@angular/router';
import { driverGuard } from './guards/driver.guard';

export const DriversRoutes: Routes = [
  {
    path: '',
    canActivate: [driverGuard],
    loadComponent: () => import('./pages/driver-info/driver-info'),

  },
];
export default DriversRoutes;
