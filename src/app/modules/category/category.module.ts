import { CategoryService } from './services/category.service';
import { CATEGORY_ROUTES } from './category.routes';

export default [
  {
    path: '',
    children: CATEGORY_ROUTES,
    providers: [CategoryService]
  }
];
