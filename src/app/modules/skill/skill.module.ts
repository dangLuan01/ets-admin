import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SKILL_ROUTES } from './skill.routes';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(SKILL_ROUTES)],
})
export class SkillModule {}
