import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Certificate,
  CertificateApiResponse,
} from '../models/certificate.model';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/certificates';

  getAll(
    page: number,
    limit: number
  ): Observable<{ data: CertificateApiResponse }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<{ data: CertificateApiResponse }>(
      `${this.apiUrl}/get-all`,
      { params }
    );
  }

  getById(id: number): Observable<{ data: Certificate }> {
    return this.http.get<{ data: Certificate }>(`${this.apiUrl}/edit/${id}`);
  }

  create(certificate: {
    code: string;
    name: string;
    description: string;
    status: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, certificate);
  }

  update(certificate: Certificate): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, certificate);
  }
}
