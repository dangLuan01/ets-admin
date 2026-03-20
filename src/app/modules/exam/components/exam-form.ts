import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExamService } from '../services/exam.service';
import { Exam, ExamStructure, QuestionItem, QuestionData, GroupData } from '../models/exam.model';
import { CertificateService } from '../../certificate/services/certificate.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    NzButtonModule,
    NzCollapseModule,
    NzListModule,
    NzCardModule,
    NzSpinModule,
    NzDividerModule,
  ],
  templateUrl: './exam-form.html',
  styleUrls: ['./exam-form.less']
})
export class ExamFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalData?: { model: Partial<Exam>, isEdit: boolean } = inject(NZ_MODAL_DATA, { optional: true });
  public modalRef = inject(NzModalRef);
  private examService = inject(ExamService);
  private certificateService = inject(CertificateService);
  private message = inject(NzMessageService);

  validateForm!: FormGroup;
  isEdit = false;
  certificates: Array<{id: number, name: string}> = [];
  
  examStructure: ExamStructure | null = null;
  isLoadingStructure = false;
  isLoadingQuestions = false;
  currentPartId: number | null = null;

  get questions() : FormArray {
    return this.validateForm.get('questions') as FormArray;
  }

  ngOnInit(): void {
    this.isEdit = !!this.modalData?.isEdit;
    this.validateForm = this.fb.group({
      cert_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      year: ['', [Validators.required]],
      total_time: ['', [Validators.required]],
      total_question: ['', [Validators.required]],
      category: [null],
      description: [null],
      thumbnail: [null],
      audio_full_url: [null],
      status: [1, [Validators.required]],
      questions: this.fb.array([])
    });

    this.certificateService.getAll(1, 50).subscribe(res => {
      this.certificates = res.data.response.map((cert: any) => ({ id: cert.id ?? 0, name: cert.name }));
    });
    
    if (this.isEdit && this.modalData?.model?.id) {
      const examId = this.modalData.model.id;
      this.examService.getDetail(examId).subscribe(res => {
        this.validateForm.patchValue(res.data);
      });

      this.isLoadingStructure = true;
      this.examService.getExamStructure(examId).subscribe(res => {
        this.examStructure = res.data;
        this.isLoadingStructure = false;
      });
    }
  }

  loadQuestionsForPart(partId: number): void {
    if (!this.modalData?.model?.id) return;
    const examId = this.modalData.model.id;

    this.currentPartId = partId;
    this.isLoadingQuestions = true;
    this.questions.clear();

    this.examService.getQuestionsByPart(examId, partId).subscribe(res => {
      res.data.items.forEach(item => {
        if (item.entity_type === 'SINGLE') {
          this.questions.push(this.createSingleQuestionGroup(item.entity_id, item.question_data));
        } else if (item.entity_type === 'GROUP') {
          this.questions.push(this.createGroupQuestionGroup(item.entity_id, item.order_index, item.group_data));
        }
      });
      this.isLoadingQuestions = false;
    });
  }

  private createSingleQuestionGroup(id: number, data?: QuestionData): FormGroup {
    return this.fb.group({
      question_id: [id],
      entity_type: ['SINGLE'],
      question_text: [data?.question_text],
      image_url: [data?.image_url],
      audio_start_ms: [data?.audio_start_ms],
      audio_end_ms: [data?.audio_end_ms],
      sub_order: Number(data?.sub_order),
      transcript: [data?.transcript],
      option_a: [data?.options?.['A']],
      option_b: [data?.options?.['B']],
      option_c: [data?.options?.['C']],
      option_d: [data?.options?.['D']],
      display_number: [data?.display_number],
      correct_answer: [data?.correct_answer],
      explanation: [data?.explanation],
    });
  }

  private createGroupQuestionGroup(id: number, orderIndex: number, data?: GroupData): FormGroup {
    const subQuestions = data?.sub_questions.map(sq => this.fb.group({
        question_id: [sq.question_id],
        question_text: [sq.question_text],
        option_a: [sq.options?.['A']],
        option_b: [sq.options?.['B']],
        option_c: [sq.options?.['C']],
        option_d: [sq.options?.['D']],
        sub_order: Number(sq.sub_order),
        display_number: [sq.display_number],
        correct_answer: [sq.correct_answer],
        explanation: [sq.explanation],
    })) || [];

    return this.fb.group({
      group_id: [id],
      entity_type: ['GROUP'],
      order_index: [orderIndex],
      passage_text: [data?.passage_text],
      image_url: [data?.image_url],
      audio_start_ms: [data?.audio_start_ms],
      audio_end_ms: [data?.audio_end_ms],
      transcript: [data?.transcript],
      sub_questions: this.fb.array(subQuestions)
    });
  }

  getSubQuestions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('sub_questions') as FormArray;
  }

  saveQuestion(index: number): void {
    const questionFormGroup = this.questions.at(index);
    const type = questionFormGroup.get('entity_type')?.value;
    const payload = questionFormGroup.value;

    if (!this.currentPartId || !this.modalData?.model?.id) return;

    payload.exam_id = this.modalData.model.id;
    payload.part_id = this.currentPartId;
   

    if (type === 'SINGLE') {
      this.examService.updateSingleQuestion(payload).subscribe({
        next: () => this.message.success(`Question updated successfully!`),
        error: (err) => this.message.error(`Failed to update question ${payload.question_id}: ${err.message}`)
      });
    } else if (type === 'GROUP') {
      this.examService.updateQuestionGroup(payload).subscribe({
        next: () => this.message.success(`Question Group updated successfully!`),
        error: (err) => this.message.error(`Failed to update group: ${err.message}`)
      });
    }
  }

  submitForm(): void {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const value = this.validateForm.value;
    if (this.isEdit && this.modalData?.model?.id) {
      this.examService.update({ ...value, id: this.modalData.model.id }).subscribe(() => {
        this.message.success('Exam details updated successfully!');
        // Note: we are not closing the modal on purpose, so user can continue editing questions.
      });
    } else {
      this.examService.create(value).subscribe(() => {
        this.modalRef.close(true); // Close on create
      });
    }
  }
}
