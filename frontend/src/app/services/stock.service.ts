import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:3000/stock';

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