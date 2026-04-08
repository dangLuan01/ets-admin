import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category, CategoryStructure } from '../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ets-category-form',
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoryFormPage {
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  category = signal<Partial<Category>>({});
  structure = signal<CategoryStructure[]>([]);
  loading = signal(false);
  isEdit = signal(false);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit.set(true);
      this.fetchCategory(id);
    }
    this.fetchStructure();
  }

  fetchCategory(id: number) {
    this.loading.set(true);
    this.categoryService.getById(id).subscribe({
      next: (cat: Category) => {
        this.category.set(cat);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  fetchStructure() {
    this.categoryService.getStructure().subscribe({
      next: (structure) => this.structure.set(structure),
      error: () => {}
    });
  }

  save() {
    this.loading.set(true);
    const data = this.category();
    const req = this.isEdit() ? this.categoryService.update(data) : this.categoryService.create(data);
    req.subscribe({
      next: () => {
        this.loading.set(false);
        // Force reload page to refresh list
        this.router.navigate(['/category']).then(() => {
          window.location.reload();
        });
      },
      error: () => this.loading.set(false)
    });
  }
}
