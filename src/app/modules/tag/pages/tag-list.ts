import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TagService } from '../services/tag.service';
import { Tag } from '../models/tag.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TagFormComponent } from '../components/tag-form';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tag-list',
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
  templateUrl: './tag-list.html',
})
export class TagListComponent implements OnInit {
  private tagService = inject(TagService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);

  tags: Tag[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.tagService.getAll(this.page, this.limit).subscribe((res) => {
      this.tags = res.data.response;
      this.limit = res.data.pagination.limit;
      this.total = res.data.pagination.total_records;
      this.cdr.detectChanges();
    });
  }

  onPageIndexChange(page: number): void {
    this.page = page;
    this.loadTags();
  }

  showCreateModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới tag',
      nzContent: TagFormComponent,
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
              this.tagService.create(componentInstance.validateForm.value).subscribe({
                next: () => {
                  this.message.success('Tag created successfully!');
                  this.loadTags();
                  modal.destroy();
                },
                error: (err) => this.message.error(`Failed to create tag: ${err.message}`)
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

  showEditModal(tag: Tag): void {
    if (!tag.id) return;
    this.tagService.getById(tag.id).subscribe((res) => {
      const modal = this.modal.create({
        nzTitle: 'Cập nhật tag',
        nzContent: TagFormComponent,
        nzWidth: '600px',
        nzCentered: true,
        nzData: {
          tag: res.data,
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
                const updatedTag = {
                  ...res.data,
                  ...componentInstance.validateForm.value,
                };
                this.tagService.update(updatedTag).subscribe({
                  next: () => {
                    this.message.success('Tag updated successfully!');
                    this.loadTags();
                    modal.destroy();
                  },
                  error: (err) => this.message.error(`Failed to update tag: ${err.message}`)
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
