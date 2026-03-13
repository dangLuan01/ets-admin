import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PartMasterService } from '../services/part-master.service';
import { PartMaster } from '../models/part-master.model';
import { SkillService } from '../../skill/services/skill.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-part-master-form',
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
  templateUrl: './part-master-form.html',
  styleUrls: ['./part-master-form.less']
})
export class PartMasterFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalData?: { model: Partial<PartMaster>, isEdit: boolean } = inject(NZ_MODAL_DATA, { optional: true });
  public modalRef = inject(NzModalRef);
  private partMasterService = inject(PartMasterService);
  private skillService = inject(SkillService);

  validateForm!: FormGroup;
  isEdit = false;
  skills: Array<{id: number, name: string}> = [];

  ngOnInit(): void {
    this.skillService.getAll(1, 50).subscribe(res => {
      this.skills = res.data.response.map((skill: any) => ({ id: skill.id ?? 0, name: skill.name }));
    });
    this.isEdit = !!this.modalData?.isEdit;
    this.validateForm = this.fb.group({
      skill_id: [this.modalData?.model?.skill_id ?? '', [Validators.required]],
      part_number: [this.modalData?.model?.part_number ?? '', [Validators.required]],
      name: [this.modalData?.model?.name ?? '', [Validators.required]],
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
      this.partMasterService.update({ ...value, id: this.modalData.model.id }).subscribe(() => {
        this.modalRef.close(true);
      });
    } else {
      this.partMasterService.create(value).subscribe(() => {
        this.modalRef.close(true);
      });
    }
  }
}
