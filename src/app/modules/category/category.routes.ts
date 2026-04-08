import { Routes } from '@angular/router';
import { CategoryListPage } from './pages/category-list';
import { CategoryFormPage } from './pages/category-form';

export const CATEGORY_ROUTES: Routes = [
  { path: '', component: CategoryListPage },
  //{ path: 'create', component: CategoryFormPage },
  //{ path: 'edit/:id', component: CategoryFormPage }
];
