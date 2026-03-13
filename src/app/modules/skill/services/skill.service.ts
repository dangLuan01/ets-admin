import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill, SkillListResponse, SkillDetailResponse } from '../models/skill.model';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private baseUrl = 'http://localhost:8080/api/v1/skills';

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 20): Observable<SkillListResponse> {
    return this.http.get<SkillListResponse>(`${this.baseUrl}/get-all?page=${page}&limit=${limit}`);
  }

  getDetail(id: number): Observable<SkillDetailResponse> {
    return this.http.get<SkillDetailResponse>(`${this.baseUrl}/edit/${id}`);
  }

  create(payload: Omit<Skill, 'id' | 'status'>): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, payload);
  }

  update(payload: Partial<Skill>): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, payload);
  }
}
