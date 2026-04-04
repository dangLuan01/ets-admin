import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainComponent } from './modules/main/main.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./modules/main/main.routes').then(m => m.MAIN_ROUTES)
  },
];
