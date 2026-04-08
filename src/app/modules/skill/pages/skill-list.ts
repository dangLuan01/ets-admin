import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SkillService } from '../services/skill.service';
import { Skill } from '../models/skill.model';
import { SkillFormComponent } from '../components/skill-form';

@Component({
  selector: 'app-skill-list',
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
  templateUrl: './skill-list.html',
  styleUrls: ['./skill-list.less']
})
export class SkillListComponent implements OnInit {
  private skillService = inject(SkillService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  skills: Skill[] = [];
  page: number = 1;
  limit: number = 20;
  total: number = 0;

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillService.getAll(this.page, this.limit).subscribe((res) => {
      this.skills = res.data.response;
      this.limit = res.data.pagination.limit;
      this.total = res.data.pagination.total_records;
      this.cdr.detectChanges();
    });
  }

  onPageIndexChange(page: number): void {
    this.page = page;
    this.loadSkills();
  }

  showCreateModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới kỹ năng',
      nzContent: SkillFormComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzData: {
        model: {},
        isEdit: false,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadSkills();
    });
  }

  showEditModal(data: Skill): void {
    const modal = this.modal.create({
      nzTitle: 'Cập nhật kỹ năng',
      nzContent: SkillFormComponent,
      nzWidth: '600px',
      nzFooter: null,
      nzData: {
        model: { ...data },
        isEdit: true,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadSkills();
    });
  }
}
