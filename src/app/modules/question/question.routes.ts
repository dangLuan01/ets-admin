import { Routes } from '@angular/router';
import { QuestionAddPage } from './pages/question-add';

export const QUESTION_ROUTES: Routes = [
  {
    path: 'add',
    component: QuestionAddPage,
  },
  {
    path: '',
    redirectTo: 'add',
    pathMatch: 'full',
  },
];
