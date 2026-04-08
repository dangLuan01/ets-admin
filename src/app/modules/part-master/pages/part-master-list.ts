import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { PartMasterService } from '../services/part-master.service';
import { PartMaster } from '../models/part-master.model';
import { PartMasterFormComponent } from '../components/part-master-form';

@Component({
  selector: 'app-part-master-list',
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
  templateUrl: './part-master-list.html',
  styleUrls: ['./part-master-list.less']
})
export class PartMasterListComponent implements OnInit {
  private partMasterService = inject(PartMasterService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  partMasters: PartMaster[] = [];
  page: number = 1;
  limit: number = 20;
  total: number = 0;

  ngOnInit(): void {
    this.loadPartMasters();
  }

  loadPartMasters(): void {
    this.partMasterService.getAll(this.page, this.limit).subscribe((res) => {
      this.partMasters = res.data.response;
      this.limit = res.data.pagination.limit;
      this.total = res.data.pagination.total_records;
      this.cdr.detectChanges();
    });
  }

  onPageIndexChange(page: number): void {
    this.page = page;
    this.loadPartMasters();
  }

  showCreateModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới Part Master',
      nzContent: PartMasterFormComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzData: {
        isEdit: false,
        model: {}
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadPartMasters();
    });
  }

  showEditModal(data: PartMaster): void {
    const modal = this.modal.create({
      nzTitle: 'Cập nhật Part Master',
      nzContent: PartMasterFormComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzData: {
        isEdit: true,
        model: { ...data }
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadPartMasters();
    });
  }
}
