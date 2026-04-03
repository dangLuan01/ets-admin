import { Component, inject } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'ets-category-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzSelectModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Tên</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="name" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSpan]="6">Loại</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="type" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSpan]="6">Cha</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="parent_id" nzAllowClear>
            <nz-option [nzValue]="null" nzLabel="-- Không --"></nz-option>
            <ng-container *ngFor="let parent of parentOptions">
              <nz-option [nzValue]="parent.id" [nzLabel]="parent.name"></nz-option>
              <ng-container *ngIf="parent.children">
                <nz-option *ngFor="let child of parent.children" [nzValue]="child.id" [nzLabel]="'— ' + child.name"></nz-option>
              </ng-container>
            </ng-container>
          </nz-select>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSpan]="6">Thứ tự</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input type="number" formControlName="priority" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSpan]="6">Trạng thái</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="status">
            <nz-option [nzValue]="1" nzLabel="Hoạt động"></nz-option>
            <nz-option [nzValue]="0" nzLabel="Không hoạt động"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSpan]="6">Lọc được?</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-select formControlName="is_filterable">
            <nz-option [nzValue]="1" nzLabel="Có"></nz-option>
            <nz-option [nzValue]="0" nzLabel="Không"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>
      <div style="text-align:right;margin-top:1rem">
        <button nz-button nzType="default" (click)="close()" type="button">Hủy</button>
        <button nz-button nzType="primary" [disabled]="form.invalid || loading" type="submit">Lưu</button>
      </div>
    </form>
  `
})
export class CategoryFormModalComponent {
  form: FormGroup;
  loading = false;
  category: Partial<Category> | null = null;
  parentOptions: Category[] = [];
  private categoryService = inject(CategoryService);
  private modalRef = inject(NzModalRef<CategoryFormModalComponent>);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);
  constructor() {
    const modalData = inject(NZ_MODAL_DATA, { optional: true }) as any;
    this.category = modalData?.category ?? null;
    this.parentOptions = modalData?.parentOptions ?? [];
    this.form = this.fb.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      parent_id: [null],
      priority: [1],
      status: [1, Validators.required],
      is_filterable: [1, Validators.required]
    });
    if (this.category) {
      this.form.patchValue({
        ...this.category,
        parent_id: this.category.parent_id != null ? this.category.parent_id : null
      });
    }
  }
  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const data = { ...this.category, ...this.form.value };
    const req = data.id ? this.categoryService.update(data) : this.categoryService.create(data);
    req.subscribe({
      next: () => {
        this.loading = false;
        this.message.success(data.id ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục thành công!');
        this.close();
      },
      error: (err) => {
        this.loading = false;
        this.message.error('Có lỗi xảy ra: ' + (err?.error?.message || err.message || err));
      }
    });
  }
  close() {
    this.modalRef.close();
  }
}
