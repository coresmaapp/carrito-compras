import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

import { authGuard } from './core/guards/auth-guard'

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./modules/login/login').then(m => m.Login)
      },
      {
        path: 'productos',
        loadComponent: () => import('./modules/productos/list/list').then(m => m.List)
      },
      {
        path: 'alta',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/altas/alta').then(m => m.Altas)
      },
    ]
  }
];
