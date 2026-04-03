import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExamService } from '../services/exam.service';
import { Exam } from '../models/exam.model';
import { ExamFormComponent } from '../components/exam-form';
import { ExamImportComponent } from '../components/exam-import/exam-import';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzTagModule,
    //ExamImportComponent,
  ],
  templateUrl: './exam-list.html',
  styleUrls: ['./exam-list.less']
})
export class ExamListComponent implements OnInit {
  private examService = inject(ExamService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  exams: Exam[] = [];
  page: number = 1;
  limit: number = 20;
  total: number = 0;

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getAll(this.page, this.limit).subscribe((res) => {
      this.exams = res.data.response;
      this.limit = res.data.pagination.limit;
      this.total = res.data.pagination.total_records;
      this.cdr.detectChanges();
    });
  }

  onPageIndexChange(page: number): void {
    this.page = page;
    this.loadExams();
  }

  showCreateModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới Exam',
      nzContent: ExamFormComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzData: {
        isEdit: false,
        model: {}
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadExams();
    });
  }

  showEditModal(data: Exam): void {
    const modal = this.modal.create({
      nzTitle: 'Cập nhật Exam',
      nzContent: ExamFormComponent,
      nzWidth: '90%',
      nzFooter: null,
      nzData: {
        isEdit: true,
        model: { ...data }
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadExams();
    });
  }

  showImportModal(data: Exam): void {
    const modal = this.modal.create({
      nzTitle: 'Import câu hỏi',
      nzContent: ExamImportComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzData: {
        exam_id: data.id
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadExams();
    });
  }
}
