import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryStructure } from '../models/category.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/category`;

  getAll(page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all`, { params: { page, limit } });
  }

  getStructure(): Observable<CategoryStructure[]> {
    return this.http.get<{ data: CategoryStructure[] }>(`${this.baseUrl}/structure`).pipe(
      map((res: { data: CategoryStructure[] }) => res.data)
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<{ data: Category }>(`${this.baseUrl}/edit/${id}`).pipe(
      map((res: { data: Category }) => res.data)
    );
  }

  create(category: Partial<Category>): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, category);
  }

  update(category: Partial<Category>): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, category);
  }
}
