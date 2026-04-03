import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CategoryFormModalComponent } from '../components/category-form-modal';

@Component({
  selector: 'ets-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    //CategoryFormModalComponent
  ]
})
export class CategoryListPage implements OnInit {
  private categoryService = inject(CategoryService);
  private modal = inject(NzModalService);
  categories: Category[] = [];
  private cdr = inject(ChangeDetectorRef);
  structure: any[] = [];
  page = 1;
  limit = 10;
  total = 0;
  loading = false;

  ngOnInit(): void {
    this.fetchCategories();
    this.categoryService.getStructure().subscribe(structure => {
      this.structure = structure;
    });
  }

  fetchCategories(page = this.page, limit = this.limit) {
    this.loading = true;
    this.categoryService.getAll(page, limit).subscribe({
      next: (res: any) => {
        this.categories = res.data.response;
        this.limit = res.data.pagination.limit;
        this.total = res.data.pagination.total_records;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageIndexChange(page: number) {
    this.page = page;
    this.fetchCategories();
  }

  getParentName(parent_id: number | null): string {
    if (!parent_id) return '';
    const parent = this.categories.find(c => c.id === parent_id);
    return parent ? parent.name : parent_id.toString();
  }

  showCreateModal() {
    this.modal.create({
      nzTitle: 'Thêm mới danh mục',
      nzContent: CategoryFormModalComponent,
      nzData: {
        category: null,
        parentOptions: this.structure
      },
      nzWidth: 600,
      nzFooter: null,
    }).afterClose.subscribe(() => this.fetchCategories());
  }

  showEditModal(category: Category) {
    this.modal.create({
      nzTitle: 'Chỉnh sửa danh mục',
      nzContent: CategoryFormModalComponent,
      nzData: {
        category: category,
        parentOptions: this.structure
      },
      nzWidth: 600,
      nzFooter: null,
    }).afterClose.subscribe(() => this.fetchCategories());
  }
}
