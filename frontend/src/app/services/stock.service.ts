import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) {}

  getStock(symbol: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/search?symbol=${symbol}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getRecentSearchHistory(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}