import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password }).pipe();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}