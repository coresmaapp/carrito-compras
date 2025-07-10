import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./modules/login/login').then(m => m.Login)
      },
      {
        path: 'producto',
        loadComponent: () => import('./modules/producto/producto').then(m => m.Producto)
      },
    ]
  }
];
