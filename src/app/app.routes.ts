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
  {
    path: 'skill',
    loadChildren: () =>
      import('./modules/skill/skill.routes').then((m) => m.SKILL_ROUTES),
  },
  {
    path: 'part-master',
    loadChildren: () =>
      import('./modules/part-master/part-master.routes').then((m) => m.PART_MASTER_ROUTES),
  },
  {
    path: 'exam',
    loadChildren: () =>
      import('./modules/exam/exam.routes').then((m) => m.EXAM_ROUTES),
  },
  {
    path: 'question',
    loadChildren: () =>
      import('./modules/question/question.routes').then((m) => m.QUESTION_ROUTES),
  },
];
