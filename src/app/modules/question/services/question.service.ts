import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, QuestionCreateResponse, QuestionGroup } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private baseUrl = 'http://localhost:8080/api/v1/questions';

  constructor(private http: HttpClient) {}

  createSingle(payload: Question): Observable<QuestionCreateResponse> {
    return this.http.post<QuestionCreateResponse>(`${this.baseUrl}/single/create`, payload);
  }

  createGroup(payload: QuestionGroup): Observable<QuestionCreateResponse> {
    return this.http.post<QuestionCreateResponse>(`${this.baseUrl}/group/create`, payload);
  }
}
