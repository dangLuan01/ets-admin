import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PartMaster, PartMasterListResponse, PartMasterDetailResponse } from '../models/part-master.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PartMasterService {
  private baseUrl = `${environment.apiUrl}/part-masters`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 20): Observable<PartMasterListResponse> {
    return this.http.get<PartMasterListResponse>(`${this.baseUrl}/get-all?page=${page}&limit=${limit}`);
  }

  getDetail(id: number): Observable<PartMasterDetailResponse> {
    return this.http.get<PartMasterDetailResponse>(`${this.baseUrl}/edit/${id}`);
  }

  create(payload: Omit<PartMaster, 'id' | 'status'>): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, payload);
  }

  update(payload: Partial<PartMaster>): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, payload);
  }
}
