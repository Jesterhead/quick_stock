import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../services/stock.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  stockData: any = null;
  recentSearchHistory: any[] = [];
  error = '';

  constructor(
    private stockService: StockService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRecentSearchHistory();
  }

  searchStock() {
    if (!this.searchQuery || this.searchQuery.trim().length === 0) {
        this.error = 'Please enter a value';
        return;
    }
    
    const trimmed = this.searchQuery.trim().toUpperCase().slice(0, 10);
      
    this.stockService.getStock(trimmed).subscribe({
    next: (data) => {
        this.stockData = data;
        this.error = '';
        this.searchQuery = '';
        this.loadRecentSearchHistory();
    },
    error: (err) => this.error = err.error.message || 'Stock not found'
    });
  }

  loadRecentSearchHistory() {
    this.stockService.getRecentSearchHistory().subscribe({
      next: (history) => this.recentSearchHistory = history,
      error: () => console.log('Failed to load history')
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Still logout locally even if backend fails
        this.router.navigate(['/login']);
      }
    });
  }
}