import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthToken } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private readonly TOKEN_KEY = 'auth_token';

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;

  constructor() {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      
      return !!this.getToken();
    }
    return false;
  }

  login(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => {
        if (response.data?.access_token) {
          const authToken: AuthToken = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
          };
          this.setToken(authToken);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    return this.http.post<any>(`${this.baseUrl}/refresh`, { refreshToken: token.refreshToken }).pipe(
      tap((response) => {
        if (response.data?.access_token) {
           const authToken: AuthToken = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
          };
          this.setToken(authToken);
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    // Đảm bảo chỉ tự động nhảy trang trên môi trường Browser
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
    }
  }

  getToken(): AuthToken | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token ? JSON.parse(token) : null;
    }
    return null;
  }

  setToken(token: AuthToken): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
    }
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  getAccessToken(): string | null {
    const token = this.getToken();
    return token ? token.accessToken : null;
  }
}
