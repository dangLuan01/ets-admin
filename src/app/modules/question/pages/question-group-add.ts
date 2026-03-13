import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuestionService } from '../services/question.service';
import { QuestionGroup, SubQuestion } from '../models/question.model';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SubQuestionFormComponent } from '../components/sub-question-form';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-question-group-add',
  templateUrl: './question-group-add.html',
  styleUrls: ['./question-group-add.less'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    SubQuestionFormComponent,
    NzDividerModule,
  ],
})
export class QuestionGroupAddPage {
  groupForm: FormGroup;

  get subQuestions(): FormArray {
    return this.groupForm.get('sub_questions') as FormArray;
  }

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.groupForm = this.fb.group({
      exam_id: [null, Validators.required],
      entity_type: ['GROUP', Validators.required],
      part_id: [null, Validators.required],
      image_url: [''],
      audio_start_ms: [null],
      audio_end_ms: [null],
      sub_questions: this.fb.array([]),
    });
  }

  addSubQuestion() {
    this.subQuestions.push(this.fb.group({
      part: [null, Validators.required],
      question_text: [''],
      image_url: [''],
      correct_answer: ['', Validators.required],
      option_a: ['', Validators.required],
      option_b: ['', Validators.required],
      option_c: ['', Validators.required],
      option_d: [''],
      sub_order: [null, Validators.required],
    }));
  }

  removeSubQuestion(idx: number) {
    this.subQuestions.removeAt(idx);
  }

  submit() {
    if (this.groupForm.valid) {
      const value: QuestionGroup = this.groupForm.value;
      this.questionService.createGroup(value).subscribe();
    } else {
      this.groupForm.markAllAsTouched();
    }
  }
}
