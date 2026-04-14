import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu, MenuStructure } from '../models/menu.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/menu`;

  getAll(page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all`, { params: { page, limit } });
  }

  getStructure(): Observable<MenuStructure[]> {
    return this.http.get<{ data: MenuStructure[] }>(`${this.baseUrl}/structure`).pipe(
      map((res: { data: MenuStructure[] }) => res.data)
    );
  }

  getById(id: number): Observable<Menu> {
    return this.http.get<{ data: Menu }>(`${this.baseUrl}/edit/${id}`).pipe(
      map((res: { data: Menu }) => res.data)
    );
  }

  create(category: Partial<Menu>): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, category);
  }

  update(category: Partial<Menu>): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, category);
  }
}
