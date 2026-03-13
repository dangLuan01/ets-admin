import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Certificate } from '../models/certificate.model';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
  ],
  templateUrl: './certificate-form.html',
})
export class CertificateFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalData?: { certificate: Certificate } = inject(NZ_MODAL_DATA, {
    optional: true,
  });

  validateForm!: FormGroup;

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      code: [this.modalData?.certificate?.code || '', [Validators.required]],
      name: [this.modalData?.certificate?.name || '', [Validators.required]],
      description: [this.modalData?.certificate?.description || ''],
      status: [this.modalData?.certificate?.status ?? 1, [Validators.required]],
    });
  }
}
