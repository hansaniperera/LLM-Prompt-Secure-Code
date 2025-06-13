import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // If already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Handles the login form submission.
   * Calls the AuthService to authenticate the user.
   */
  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = ''; // Clear previous errors

    this.authService.login(this.username, this.password)
      .subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/home']); // Navigate to home on success
          } else {
            // This path should ideally not be hit due to throwError in service
            this.errorMessage = 'Login failed. Please try again.';
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'An unexpected error occurred during login.';
          console.error('Login error:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}