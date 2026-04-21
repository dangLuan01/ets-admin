import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  {
    path: 'welcome',
    loadChildren: () => import('../welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
  {
    path: 'certificate',
    loadChildren: () =>
      import('../certificate/certificate.routes').then((m) => m.CERTIFICATE_ROUTES),
  },
  {
    path: 'skill',
    loadChildren: () =>
      import('../skill/skill.routes').then((m) => m.SKILL_ROUTES),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('../category/category.routes').then((m) => m.CATEGORY_ROUTES),
  },
  {
    path: 'part-master',
    loadChildren: () =>
      import('../part-master/part-master.routes').then((m) => m.PART_MASTER_ROUTES),
  },
  {
    path: 'exam',
    loadChildren: () =>
      import('../exam/exam.routes').then((m) => m.EXAM_ROUTES),
  },
  {
    path: 'question',
    loadChildren: () =>
      import('../question/question.routes').then((m) => m.QUESTION_ROUTES),
  },
  {
    path: 'post',
    loadChildren: () =>
      import('../post/post.routes').then((m) => m.POST_ROUTES),
  },
  {
    path: 'tag',
    loadChildren: () =>
      import('../tag/tag.routes').then((m) => m.TAG_ROUTES),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('../menu/menu.routes').then((m) => m.MENU_ROUTES),
  },
];
