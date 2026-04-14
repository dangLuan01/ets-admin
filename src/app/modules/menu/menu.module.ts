import { MenuService } from './services/menu.service';
import { MENU_ROUTES } from './menu.routes';

export default [
  {
    path: '',
    children: MENU_ROUTES,
    providers: [MenuService]
  }
];
