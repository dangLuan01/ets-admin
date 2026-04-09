import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ExamService } from '../services/exam.service';
import { Direction, PartDirectionUpdatePayload } from '../models/exam.model';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Underline, Strikethrough, 
  Code, Heading, List, Indent, BlockQuote, Link, Table, TableToolbar, Undo
} from 'ckeditor5';

@Component({
  selector: 'app-direction-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzInputNumberModule,
    CKEditorModule
  ],
  templateUrl: './direction-edit-form.html',
  styleUrls: ['./direction-edit-form.less'],
  encapsulation: ViewEncapsulation.None
})
export class DirectionEditFormComponent implements OnInit {
  public Editor = ClassicEditor;

  public config = {
    licenseKey: 'GPL',

    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Code,
      Heading,
      List,
      Indent,
      BlockQuote,
      Link,
      Table,
      TableToolbar,
      Undo,
    ],

    toolbar: [
      'undo', 'redo',
      '|',
      'heading',
      '|',
      'bold', 'italic', 'underline', 'strikethrough', 'code',
      '|',
      'link', 'uploadImage',
      '|',
      'bulletedList', 'numberedList',
      'outdent', 'indent',
      '|',
      'blockQuote',
      '|',
      'insertTable',
    ],
  };
  private fb = inject(FormBuilder);
  private modalData: { direction: Direction, examId: number, partId: number } = inject(NZ_MODAL_DATA);
  public modalRef = inject(NzModalRef);
  private examService = inject(ExamService);
  private message = inject(NzMessageService);

  form!: FormGroup;

  ngOnInit(): void {
    const direction = this.modalData.direction;

    this.form = this.fb.group({
      direction_text: [direction?.text],
      audio_start_ms: [direction?.audio_start_ms],
      audio_end_ms: [direction?.audio_end_ms],
      example_data: this.fb.group({
        image_url: [direction?.example?.image_url],
        explanation: [direction?.example?.explanation],
        audio_start_ms: [direction?.example?.audio_start_ms],
        audio_end_ms: [direction?.example?.audio_end_ms],
        correct_option: [direction?.example?.correct_option],
      }),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const exampleData = formValue.example_data;

    const isExampleDataEmpty = Object.values(exampleData).every(
      val => val === null || val === '' || val === undefined
    );

    const payload: PartDirectionUpdatePayload = {
      exam_id: this.modalData.examId,
      part_id: this.modalData.partId,
      direction_text: formValue.direction_text,
      audio_start_ms: formValue.audio_start_ms,
      audio_end_ms: formValue.audio_end_ms,
      example_data: isExampleDataEmpty ? undefined : exampleData,
    };

    this.examService.updatePartDirection(payload).subscribe({
      next: () => {
        this.message.success('Direction updated successfully!');
        // Remap to Direction model before closing
        const updatedDirection: Direction = {
          text: payload.direction_text || '',
          audio_start_ms: payload.audio_start_ms || 0,
          audio_end_ms: payload.audio_end_ms || 0,
          ...(payload.example_data && {
            example: {
              image_url: payload.example_data.image_url || '',
              explanation: payload.example_data.explanation || '',
              correct_option: payload.example_data.correct_option || '',
              audio_start_ms: payload.example_data.audio_start_ms || 0,
              audio_end_ms: payload.example_data.audio_end_ms || 0,
            }
          })
        };
        this.modalRef.close(updatedDirection);
      },
      error: () => {
        this.message.error('Failed to update direction.');
      },
    });
  }
}
