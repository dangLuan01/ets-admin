import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { Component, OnInit, inject, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { Exam, ExamStructure, QuestionData, GroupData, Direction, FilterStructureNode } from '../models/exam.model';
import { CertificateService } from '../../certificate/services/certificate.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DirectionEditFormComponent } from './direction-edit-form';
import { generateSlug } from '../../../shared/utils/string.utils';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CkEditor, CkEditorConfig } from '../../../shared/configs/ckeditor.config';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzIconModule, 
    NzSelectModule, NzButtonModule, NzCollapseModule, NzListModule, NzCardModule, NzSpinModule, 
    NzDividerModule, NzTreeSelectModule, CKEditorModule
  ],
  templateUrl: './exam-form.html',
  styleUrls: ['./exam-form.less'],
  encapsulation: ViewEncapsulation.None
})
export class ExamFormComponent implements OnInit {
  public Editor = CkEditor;
  public config = CkEditorConfig;
  private fb = inject(FormBuilder);
  private modalData?: { model: Partial<Exam>, isEdit: boolean } = inject(NZ_MODAL_DATA, { optional: true });
  public modalRef = inject(NzModalRef);
  private examService = inject(ExamService);
  private certificateService = inject(CertificateService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  validateForm!: FormGroup;
  isEdit = false;
  certificates: Array<{id: number, name: string}> = [];
  categoryNodes: FilterStructureNode[] = [];
  
  examStructure: ExamStructure | null = null;
  isLoadingStructure = false;
  isLoadingQuestions = false;
  currentPartId: number | null = null;
  currentPartDirection: Direction | null = null;

  // Properties for Target Exam functionality
  allExams: Exam[] = [];
  targetExamPage = 1;
  targetExamLimit = 10;
  isLoadingTargetExams = false;
  hasMoreTargetExams = true;
  targetExamStructure: ExamStructure | null = null;
  isLoadingTargetStructure = false;
  targetPartNodes: any[] = [];

  get questions() : FormArray {
    return this.validateForm.get('questions') as FormArray;
  }

  ngOnInit(): void {
    this.isEdit = !!this.modalData?.isEdit;
    
    this.validateForm = this.fb.group({
      cert_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      year: ['', [Validators.required]],
      total_time: ['', [Validators.required]],
      total_question: ['', [Validators.required]],
      category_ids: [[]],
      description: [null],
      thumbnail: [null],
      audio_full_url: [null],
      status: [1, [Validators.required]],
      questions: this.fb.array([]),
      target: this.fb.group({
        target_exam_id: [null],
        target_part_id: [[]]
      })
    });

    this.certificateService.getAll(1, 50).subscribe(res => {
      this.certificates = res.data.response.map((cert: any) => ({ id: cert.id ?? 0, name: cert.name }));
    });

    if (this.isEdit && this.modalData?.model?.id) {
      const examId = this.modalData.model.id;
      this.isLoadingStructure = true;

      forkJoin({
        categories: this.examService.getFilterStructure(),
        details: this.examService.getDetail(examId),
        structure: this.examService.getExamStructure(examId)
      }).subscribe(({ categories, details, structure }) => {
        this.categoryNodes = this.mapTreeNodes(categories.data);
        
        const examData = details.data;
        // WORKAROUND: Convert IDs to strings for nz-tree-select to correctly display checked values.
        if (examData.category_ids) {
          (examData as any).category_ids = examData.category_ids.map(id => `${id}`);
        }
        // Convert target_part_id to strings for nz-tree-select
        if (examData.target && examData.target.target_part_id) {
          (examData.target as any).target_part_id = examData.target.target_part_id.map(id => `${id}`);
        }

        this.validateForm.patchValue(examData);
        this.examStructure = structure.data;

        // If a target is set, load its structure
        if (examData.target && examData.target.target_exam_id) {
          this.onTargetExamChange(examData.target.target_exam_id, true);
        }

        this.isLoadingStructure = false;
        this.cdr.detectChanges();
      });

    } else {
      // Create mode: only needs categories
      this.examService.getFilterStructure().subscribe(res => {
        this.categoryNodes = this.mapTreeNodes(res.data);
      });
    }

    // Load the first page of target exams
    this.loadMoreTargetExams();

    this.validateForm.get('title')?.valueChanges.subscribe(val => {
      if (val) {
        const slug = generateSlug(val);
        this.validateForm.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  loadMoreTargetExams(): void {
    if (this.isLoadingTargetExams || !this.hasMoreTargetExams) {
      return;
    }

    this.isLoadingTargetExams = true;
    this.examService.getAll(this.targetExamPage, this.targetExamLimit).subscribe({
      next: res => {
        let newExams = res.data.response;
        if (this.isEdit && this.modalData?.model?.id) {
          const modelId = this.modalData.model.id;
          newExams = newExams.filter(exam => exam.id !== modelId);
        }
        
        this.allExams = [...this.allExams, ...newExams];
        this.hasMoreTargetExams = res.data.pagination.has_next;
        this.targetExamPage++;
        this.isLoadingTargetExams = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message.error('Failed to load list of exams. Please try again.');
        this.isLoadingTargetExams = false;
      }
    });
  }

  onTargetExamChange(examId: number | null, preserveValue = false): void {
    const targetPartControl = this.validateForm.get('target.target_part_id');
    if (!examId) {
      this.targetExamStructure = null;
      this.targetPartNodes = [];
      if (!preserveValue) {
        targetPartControl?.setValue([]);
      }
      return;
    }

    this.isLoadingTargetStructure = true;
    this.examService.getExamStructure(examId).subscribe(res => {
      this.targetExamStructure = res.data;
      this.targetPartNodes = this.mapTargetPartNodes(res.data.blueprint);
      if (!preserveValue) {
        targetPartControl?.setValue([]); // Reset selection
      }
      this.isLoadingTargetStructure = false;
      this.cdr.detectChanges();
    });
  }

  private mapTargetPartNodes(blueprint: any[]): any[] {
    return blueprint.map(skill => ({
      title: skill.skill_name,
      key: `skill-${skill.skill_id}`,
      isLeaf: false,
      disableCheckbox: true, // Prevent parent selection
      children: skill.parts.map((part: any) => ({
        title: `${part.part_name} (Part ${part.part_number})`,
        key: `${part.part_id}`, // Ensure key is a string
        isLeaf: true
      }))
    }));
  }

  private mapTreeNodes(nodes: FilterStructureNode[]): FilterStructureNode[] {
    return nodes.map(node => {
      const newNode: FilterStructureNode = {
        ...node,
        key: `${node.id}`,
        value: node.id,
        title: node.name,
        isLeaf: !node.children || node.children.length === 0
      };
      if (node.children && node.children.length > 0) {
        newNode.children = this.mapTreeNodes(node.children);
      }
      return newNode;
    });
  }


  loadQuestionsForPart(partId: number): void {
    if (!this.modalData?.model?.id) return;
    const examId = this.modalData.model.id;

    this.currentPartId = partId;
    this.isLoadingQuestions = true;
    this.questions.clear();
    this.currentPartDirection = null;

    this.examService.getQuestionsByPart(examId, partId).subscribe(res => {
      this.currentPartDirection = res.data.direction ?? null;
      res.data.items?.forEach(item => {
        if (item.entity_type === 'SINGLE') {
          this.questions.push(this.createSingleQuestionGroup(item.entity_id, item.question_data));
        } else if (item.entity_type === 'GROUP') {
          this.questions.push(this.createGroupQuestionGroup(item.entity_id, item.order_index, item.group_data));
        }
      });
      this.isLoadingQuestions = false;
      this.cdr.detectChanges();
    });
  }

  showEditDirectionModal(): void {
    if (!this.currentPartDirection || !this.currentPartId || !this.modalData?.model?.id) return;

    const modal = this.modal.create({
      nzTitle: 'Edit Part Direction',
      nzContent: DirectionEditFormComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzData: {
        direction: this.currentPartDirection,
        examId: this.modalData.model.id,
        partId: this.currentPartId,
      },
    });

    modal.afterClose.subscribe((result: Direction | false) => {
      if (result) {
        this.currentPartDirection = result;
      }
    });
  }

  private createSingleQuestionGroup(id: number, data?: QuestionData): FormGroup {
    return this.fb.group({
      question_id: [id],
      entity_type: ['SINGLE'],
      question_text: [data?.question_text],
      image_url: [data?.image_url],
      audio_start_ms: Number(data?.audio_start_ms),
      audio_end_ms: Number(data?.audio_end_ms),
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
        transcript: [sq.transcript]
    })) || [];

    return this.fb.group({
      group_id: [id],
      entity_type: ['GROUP'],
      order_index: [orderIndex],
      passage_text: [data?.passage_text],
      image_url: [data?.image_url],
      audio_start_ms: Number(data?.audio_start_ms),
      audio_end_ms: Number(data?.audio_end_ms),
      explanation: [data?.explanation],
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

    const formValue = { ...this.validateForm.getRawValue() };

    // WORKAROUND: Convert string IDs from tree-select back to numbers for the API.
    if (formValue.category_ids && Array.isArray(formValue.category_ids)) {
      formValue.category_ids = formValue.category_ids.map((id: string) => parseInt(id, 10));
    }

    // Handle target object: set to null if no target exam is selected
    if (formValue.target && !formValue.target.target_exam_id) {
      formValue.target = null;
    } else if (formValue.target && Array.isArray(formValue.target.target_part_id)) {
      // Filter out non-numeric keys (like 'skill-x') and convert valid ones to numbers.
      formValue.target.target_part_id = formValue.target.target_part_id
        .map((id: string) => parseInt(id, 10))
        .filter((id: number) => !isNaN(id));
    }

    if (this.isEdit && this.modalData?.model?.id) {
      this.examService.update({ ...formValue, id: this.modalData.model.id }).subscribe(() => {
        this.message.success('Exam details updated successfully!');
        // Note: we are not closing the modal on purpose, so user can continue editing questions.
      });
    } else {
      this.examService.create(formValue).subscribe(() => {
        this.modalRef.close(true); // Close on create
      });
    }
  }
}