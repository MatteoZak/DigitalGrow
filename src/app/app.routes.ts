import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'plant-detailed-tips',
    loadComponent: () => import('./plant-detailed-tips/plant-detailed-tips.page').then( m => m.PlantDetailedTipsPage)
  },
];
