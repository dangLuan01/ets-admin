import { Routes } from '@angular/router';
import { MenuListPage } from './pages/menu-list';
import { MenuFormPage } from './pages/menu-form';

export const MENU_ROUTES: Routes = [
  { path: '', component: MenuListPage },
  //{ path: 'create', component: CategoryFormPage },
  //{ path: 'edit/:id', component: CategoryFormPage }
];
