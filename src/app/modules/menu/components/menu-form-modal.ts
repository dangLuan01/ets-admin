import { Component, inject } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { Menu } from '../models/menu.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'ets-menu-form-modal',
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
        <nz-form-label [nzSpan]="6">Slug</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="slug" />
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
      <div style="text-align:right;margin-top:1rem">
        <button nz-button nzType="default" (click)="close()" type="button">Hủy</button>
        <button nz-button nzType="primary" [disabled]="form.invalid || loading" type="submit">Lưu</button>
      </div>
    </form>
  `
})
export class MenuFormModalComponent {
  form: FormGroup;
  loading = false;
  menu: Partial<Menu> | null = null;
  parentOptions: Menu[] = [];
  private menuService = inject(MenuService);
  private modalRef = inject(NzModalRef<MenuFormModalComponent>);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);
  constructor() {
    const modalData = inject(NZ_MODAL_DATA, { optional: true }) as any;
    this.menu = modalData?.menu ?? null;
    this.parentOptions = modalData?.parentOptions ?? [];
    this.form = this.fb.group({
      name: [null, Validators.required],
      slug: [null],
      type: [null, Validators.required],
      parent_id: [null],
      priority: [1],
      status: [1, Validators.required],
    });
    if (this.menu) {
      this.form.patchValue({
        ...this.menu,
        parent_id: this.menu.parent_id != null ? this.menu.parent_id : null
      });
    }
  }
  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const data = { ...this.menu, ...this.form.value };
    const req = data.id ? this.menuService.update(data) : this.menuService.create(data);
    req.subscribe({
      next: () => {
        this.loading = false;
        this.message.success(data.id ? 'Cập nhật menu thành công!' : 'Tạo menu thành công!');
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
