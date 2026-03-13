import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ExamService } from '../services/exam.service';
import { Exam } from '../models/exam.model';
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

  validateForm!: FormGroup;
  isEdit = false;
  certificates: Array<{id: number, name: string}> = [];

  ngOnInit(): void {
    this.certificateService.getAll(1, 50).subscribe(res => {
      this.certificates = res.data.response.map((cert: any) => ({ id: cert.id ?? 0, name: cert.name }));
    });
    this.isEdit = !!this.modalData?.isEdit;
    this.validateForm = this.fb.group({
      cert_id: [this.modalData?.model?.cert_id ?? '', [Validators.required]],
      title: [this.modalData?.model?.title ?? '', [Validators.required]],
      year: [this.modalData?.model?.year ?? '', [Validators.required]],
      total_time: [this.modalData?.model?.total_time ?? '', [Validators.required]],
      total_question: [this.modalData?.model?.total_question ?? '', [Validators.required]],
      category: [this.modalData?.model?.category ?? null],
      description: [this.modalData?.model?.description ?? null],
      thumbnail: [this.modalData?.model?.thumbnail ?? null],
      audio_full_url: [this.modalData?.model?.audio_full_url ?? null],
      status: [this.modalData?.model?.status ?? 1, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }
    const value = this.validateForm.value;
    if (this.isEdit && this.modalData?.model?.id) {
      this.examService.update({ ...value, id: this.modalData.model.id }).subscribe(() => {
        this.modalRef.close(true);
      });
    } else {
      this.examService.create(value).subscribe(() => {
        this.modalRef.close(true);
      });
    }
  }
}
