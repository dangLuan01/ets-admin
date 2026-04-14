import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { Menu, MenuStructure } from '../models/menu.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ets-menu-form',
  templateUrl: './menu-form.html',
  styleUrls: ['./menu-form.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MenuFormPage {
  private menuService = inject(MenuService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  menu = signal<Partial<Menu>>({});
  structure = signal<MenuStructure[]>([]);
  loading = signal(false);
  isEdit = signal(false);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit.set(true);
      this.fetchMenu(id);
    }
    this.fetchStructure();
  }

  fetchMenu(id: number) {
    this.loading.set(true);
    this.menuService.getById(id).subscribe({
      next: (menu: Menu) => {
        this.menu.set(menu);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  fetchStructure() {
    this.menuService.getStructure().subscribe({
      next: (structure) => this.structure.set(structure),
      error: () => {}
    });
  }

  save() {
    this.loading.set(true);
    const data = this.menu();
    const req = this.isEdit() ? this.menuService.update(data) : this.menuService.create(data);
    req.subscribe({
      next: () => {
        this.loading.set(false);
        // Force reload page to refresh list
        this.router.navigate(['/menu']).then(() => {
          window.location.reload();
        });
      },
      error: () => this.loading.set(false)
    });
  }
}
