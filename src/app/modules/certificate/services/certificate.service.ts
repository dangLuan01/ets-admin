import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/certificates';

  getAll(): Observable<{ data: Certificate[] }> {
    return this.http.get<{ data: Certificate[] }>(`${this.apiUrl}/get-all`);
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
