import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CertificateService } from '../services/certificate.service';
import { Certificate } from '../models/certificate.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CertificateFormComponent } from '../components/certificate-form';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzTagModule,
  ],
  templateUrl: './certificate-list.html',
  styleUrl: './certificate-list.less',
})
export class CertificateListComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  certificates: Certificate[] = [];

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.certificateService.getAll().subscribe((res) => {
      this.certificates = res.data;
      this.cdr.detectChanges();
    });
  }

  showCreateModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới chứng chỉ',
      nzContent: CertificateFormComponent,
      nzWidth: '600px',
      nzCentered: true,
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Tạo mới',
          type: 'primary',
          onClick: (componentInstance) => {
            if (componentInstance?.validateForm.valid) {
              this.certificateService
                .create(componentInstance.validateForm.value)
                .subscribe(() => {
                  this.loadCertificates();
                  modal.destroy();
                });
            } else {
              componentInstance?.validateForm.markAsDirty();
              componentInstance?.validateForm.updateValueAndValidity();
            }
          },
        },
      ],
    });
  }

  showEditModal(certificate: Certificate): void {
    if (!certificate.id) return;
    this.certificateService.getById(certificate.id).subscribe((res) => {
      const modal = this.modal.create({
        nzTitle: 'Cập nhật chứng chỉ',
        nzContent: CertificateFormComponent,
        nzWidth: '600px',
        nzCentered: true,
        nzData: {
          certificate: res.data,
        },
        nzFooter: [
          {
            label: 'Hủy',
            onClick: () => modal.destroy(),
          },
          {
            label: 'Cập nhật',
            type: 'primary',
            onClick: (componentInstance) => {
              if (componentInstance?.validateForm.valid) {
                const updatedCertificate = {
                  ...res.data,
                  ...componentInstance.validateForm.value,
                };
                this.certificateService
                  .update(updatedCertificate)
                  .subscribe(() => {
                    this.loadCertificates();
                    modal.destroy();
                  });
              } else {
                componentInstance?.validateForm.markAsDirty();
                componentInstance?.validateForm.updateValueAndValidity();
              }
            },
          },
        ],
      });
    });
  }
}

