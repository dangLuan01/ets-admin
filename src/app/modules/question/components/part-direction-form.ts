import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { QuestionService } from '../services/question.service';
import { PartDirection } from '../models/question.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-part-direction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzInputNumberModule,
  ],
  templateUrl: './part-direction-form.html',
  styleUrls: ['./part-direction-form.less'],
})
export class PartDirectionFormComponent implements OnInit {
  @Input() examId!: number;
  @Input() partId!: number;
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      direction_text: [''],
      audio_start_ms: [null],
      audio_end_ms: [null],
      example_data: this.fb.group({
        image_url: [''],
        explanation: [''],
        audio_start_ms: [null],
        audio_end_ms: [null],
        correct_option: [''],
      }),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: PartDirection = {
      exam_id: this.examId,
      part_id: this.partId,
      ...this.form.value,
    };

    const exampleData = payload.example_data;
    if (exampleData) {
      const isExampleDataEmpty = Object.values(exampleData).every(
        val => val === null || val === ''
      );
      if (isExampleDataEmpty) {
        payload.example_data = undefined;
      }
    }

    this.questionService.createPartDirection(payload).subscribe({
      next: () => {
        this.message.success('Part Direction created successfully!');
        this.form.reset();
        this.saved.emit();
      },
      error: () => {
        this.message.error('Failed to create Part Direction.');
      },
    });
  }
}
