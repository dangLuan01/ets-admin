import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../services/question.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.html',
  styleUrls: ['./question-form.less'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzRadioModule,
    NzGridModule,
  ],
})
export class QuestionFormComponent implements OnInit {
  @Input() examId!: number;
  @Input() partId!: number;
  @Input() partNumber!: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  questionForm!: FormGroup;

  constructor(private fb: FormBuilder, private questionService: QuestionService) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      exam_id: [this.examId, Validators.required],
      entity_type: ['SINGLE', Validators.required],
      part_id: [this.partId, Validators.required],
      part: [this.partNumber, Validators.required],
      question_text: [''],
      image_url: [''],
      correct_answer: ['', Validators.required],
      option_a: ['', Validators.required],
      option_b: ['', Validators.required],
      option_c: ['', Validators.required],
      option_d: [''],
      audio_start_ms: [null],
      audio_end_ms: [null],
      sub_order: [null, Validators.required],
    });
  }

  submitForm(): void {
    if (this.questionForm.invalid) {
      Object.values(this.questionForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }
    const value = {
      ...this.questionForm.value,
      exam_id: this.examId,
      part_id: this.partId,
      part: this.partNumber,
      entity_type: 'SINGLE',
    };
    this.questionService.createSingle(value).subscribe(() => {
      this.saved.emit();
      this.questionForm.reset();
    });
  }
}
