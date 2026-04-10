import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../services/stock.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

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
  isDark$: any;

  constructor(
    private authService: AuthService,
    private stockService: StockService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isDark$ = this.themeService.isDark$;
    
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
    this.loadRecentSearchHistory();
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  searchStock() {
    if (!this.searchQuery || this.searchQuery.trim().length === 0) {
      this.error = 'Please enter a value';
      return;
    }
    
    const trimmed = this.searchQuery.trim().toUpperCase();
      
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