import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam, ExamListResponse, ExamDetailResponse } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private baseUrl = 'http://localhost:8080/api/v1/exams';

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 20): Observable<ExamListResponse> {
    return this.http.get<ExamListResponse>(`${this.baseUrl}/get-all?page=${page}&limit=${limit}`);
  }

  getDetail(id: number): Observable<ExamDetailResponse> {
    return this.http.get<ExamDetailResponse>(`${this.baseUrl}/edit/${id}`);
  }

  create(payload: Omit<Exam, 'id' | 'created_at' | 'status'>): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, payload);
  }

  update(payload: Partial<Exam>): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, payload);
  }
}
