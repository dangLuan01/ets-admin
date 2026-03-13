import type { Certificate } from '../../certificate/models/certificate.model';
import { CertificateService } from '../../certificate/services/certificate.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SkillService } from '../services/skill.service';
import { Skill } from '../models/skill.model';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-skill-form',
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
  templateUrl: './skill-form.html',
})
export class SkillFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalData?: { model: Partial<Skill>, isEdit: boolean } = inject(NZ_MODAL_DATA, { optional: true });
  public modalRef = inject(NzModalRef);
  private skillService = inject(SkillService);
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
      code: [this.modalData?.model?.code ?? '', [Validators.required]],
      name: [this.modalData?.model?.name ?? '', [Validators.required]],
      order_index: [this.modalData?.model?.order_index ?? '', [Validators.required]],
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
      this.skillService.update({ ...value, id: this.modalData.model.id }).subscribe(() => this.modalRef.close(true));
    } else {
      this.skillService.create(value).subscribe(() => this.modalRef.close(true));
    }
  }
}
