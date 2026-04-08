import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class HomeComponent {
  searchQuery = '';
  stockData: any = null;
  error = '';

  constructor(private stockService: StockService) {}

  searchStock() {
    if (!this.searchQuery) return;
    
    this.stockService.getStock(this.searchQuery).subscribe({
      next: (data) => {
        this.stockData = data;
        this.error = '';
      },
      error: () => this.error = 'Stock not found'
    });
  }
}