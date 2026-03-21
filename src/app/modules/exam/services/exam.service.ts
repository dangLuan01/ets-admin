import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Exam, 
  ExamListResponse, 
  ExamDetailResponse, 
  ExamStructureResponse, 
  QuestionsByPartResponse,
  UpdateSingleQuestionPayload,
  UpdateQuestionGroupPayload,
  PartDirectionUpdatePayload
} from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 20): Observable<ExamListResponse> {
    return this.http.get<ExamListResponse>(`${this.baseUrl}/exams/get-all?page=${page}&limit=${limit}`);
  }

  getDetail(id: number): Observable<ExamDetailResponse> {
    return this.http.get<ExamDetailResponse>(`${this.baseUrl}/exams/edit/${id}`);
  }

  create(payload: Omit<Exam, 'id' | 'created_at' | 'status'>): Observable<any> {
    return this.http.post(`${this.baseUrl}/exams/create`, payload);
  }

  update(payload: Partial<Exam>): Observable<any> {
    return this.http.put(`${this.baseUrl}/exams/update`, payload);
  }

  getExamStructure(examId: number): Observable<ExamStructureResponse> {
    return this.http.get<ExamStructureResponse>(`${this.baseUrl}/exams/${examId}/structure`);
  }

  getQuestionsByPart(examId: number, partId: number): Observable<QuestionsByPartResponse> {
    return this.http.get<QuestionsByPartResponse>(`${this.baseUrl}/exams/${examId}/parts/${partId}`);
  }

  updateSingleQuestion(payload: UpdateSingleQuestionPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/exams/questions/update`, payload);
  }

  updateQuestionGroup(payload: UpdateQuestionGroupPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/exams/question-groups/update`, payload);
  }

  updatePartDirection(payload: PartDirectionUpdatePayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/exams/part-direction/update`, payload);
  }
}
