import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  {
    path: 'welcome',
    loadChildren: () => import('./modules/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
  {
    path: 'certificate',
    loadChildren: () =>
      import('./modules/certificate/certificate.routes').then((m) => m.CERTIFICATE_ROUTES),
  },
];
