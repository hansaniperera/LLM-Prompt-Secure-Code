import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false; // To show loading state

  constructor(
    private fb: FormBuilder, // FormBuilder for reactive forms
    private authService: AuthService, // Our authentication service
    private router: Router // Angular Router for navigation
  ) {
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username is required
      password: ['', Validators.required]  // Password is required
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Handles the form submission for login.
   * Calls the AuthService to attempt login.
   */
  onSubmit(): void {
    this.errorMessage = null; // Clear previous error messages
    this.loading = true; // Set loading state to true

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          this.loading = false; // Reset loading state
          if (response.success) {
            console.log('Login successful:', response.message);
            this.router.navigate(['/home']); // Navigate to home page on success
          } else {
            // This path might not be reached with current mock, but good practice
            this.errorMessage = 'Login failed: ' + response.message;
          }
        },
        error: (err) => {
          this.loading = false; // Reset loading state
          console.error('Login error:', err);
          this.errorMessage = 'Login failed. Please check your credentials.'; // Display generic error
        }
      });
    } else {
      this.loading = false; // Reset loading state
      this.errorMessage = 'Please enter both username and password.';
    }
  }
}