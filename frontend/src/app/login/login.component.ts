import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';

    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        console.log(err)
        this.error = err.error?.message || err.message || 'Login failed. Please try again.';
      }
    });
  }
}