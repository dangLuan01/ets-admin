import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { Menu } from '../models/menu.model';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { MenuFormModalComponent } from '../components/menu-form-modal';

@Component({
  selector: 'ets-menu-list',
  templateUrl: './menu-list.html',
  styleUrls: ['./menu-list.less'],
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
    //MenuFormModalComponent
  ]
})
export class MenuListPage implements OnInit {
  private menuService = inject(MenuService);
  private modal = inject(NzModalService);
  menus: Menu[] = [];
  private cdr = inject(ChangeDetectorRef);
  structure: any[] = [];
  page = 1;
  limit = 10;
  total = 0;
  loading = false;

  ngOnInit(): void {
    this.fetchMenus();
    this.menuService.getStructure().subscribe(structure => {
      this.structure = structure;
    });
  }

  fetchMenus(page = this.page, limit = this.limit) {
    this.loading = true;
    this.menuService.getAll(page, limit).subscribe({
      next: (res: any) => {
        this.menus = res.data.response;
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
    this.fetchMenus();
  }

  getParentName(parent_id: number | null): string {
    if (!parent_id) return '';
    const parent = this.menus.find(c => c.id === parent_id);
    return parent ? parent.name : parent_id.toString();
  }

  showCreateModal() {
    this.modal.create({
      nzTitle: 'Thêm mới menu',
      nzContent: MenuFormModalComponent,
      nzData: {
        menu: null,
        parentOptions: this.structure
      },
      nzWidth: 600,
      nzFooter: null,
    }).afterClose.subscribe(() => this.fetchMenus());
  }

  showEditModal(menu: Menu) {
    this.modal.create({
      nzTitle: 'Chỉnh sửa menu',
      nzContent: MenuFormModalComponent,
      nzData: {
        menu: menu,
        parentOptions: this.structure
      },
      nzWidth: 600,
      nzFooter: null,
    }).afterClose.subscribe(() => this.fetchMenus());
  }
}
