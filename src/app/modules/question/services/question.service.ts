import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PartDirection, Question, QuestionCreateResponse, QuestionGroup } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  createSingle(payload: Question): Observable<QuestionCreateResponse> {
    return this.http.post<QuestionCreateResponse>(`${this.baseUrl}/questions/single/create`, payload);
  }

  createGroup(payload: QuestionGroup): Observable<QuestionCreateResponse> {
    return this.http.post<QuestionCreateResponse>(`${this.baseUrl}/questions/group/create`, payload);
  }

  createPartDirection(payload: PartDirection): Observable<QuestionCreateResponse> {
    return this.http.post<QuestionCreateResponse>(`${this.baseUrl}/exams/part-direction/create`, payload);
  }
}

