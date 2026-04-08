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
    return this.http.get(`${this.apiUrl}/search?symbol=${symbol}`);
  }
}