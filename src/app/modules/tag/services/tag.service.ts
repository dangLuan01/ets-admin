import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Tag,
  TagApiResponse,
} from '../models/tag.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tag`;

  getAll(
    page: number,
    limit: number
  ): Observable<{ data: TagApiResponse }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<{ data: TagApiResponse }>(
      `${this.apiUrl}/get-all`,
      { params }
    );
  }

  getById(id: number): Observable<{ data: Tag }> {
    return this.http.get<{ data: Tag }>(`${this.apiUrl}/edit/${id}`);
  }

  create(tag: {
    name: string;
    slug: string;
    status: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, tag);
  }

  update(tag: Tag): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, tag);
  }
}
