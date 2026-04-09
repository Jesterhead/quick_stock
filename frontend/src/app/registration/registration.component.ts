import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class RegistrationComponent {
  username = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';

    if (!this.username || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters';
      return;
    }

    this.loading = true;
    this.authService.register(this.username, this.password).subscribe({
        next: (response) => {
          this.success = 'Registration successful! Redirecting to login...';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Invalid input. Please check your username and password format.';
        }
      });
  }
}