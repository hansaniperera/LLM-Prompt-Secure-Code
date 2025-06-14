// src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login', // The custom HTML tag for this component
  templateUrl: './login.component.html', // Path to the component's HTML template
  styleUrls: ['./login.component.scss'] // Path to the component's CSS styles
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; // Reactive form group to manage form controls and validation
  errorMessage: string | null = null; // Property to store and display login error messages
  loading: boolean = false; // Flag to indicate if a login request is in progress

  constructor(
    private fb: FormBuilder, // FormBuilder for creating reactive forms
    private authService: AuthService, // Injected AuthService for handling login API calls
    private router: Router // Router for programmatic navigation
  ) {
    // Initialize the login form with form controls and validation rules
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username control, required
      password: ['', Validators.required]  // Password control, required
    });
  }

  ngOnInit(): void {
    // Check if the user is already authenticated. If so, navigate to home.
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Handles the submission of the login form.
   *
   * @returns void
   */
  onSubmit(): void {
    this.errorMessage = null; // Clear any previous error messages
    this.loading = true; // Set loading flag to true

    // Check if the form is valid before attempting login
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Get username and password from form

      // Call the login method from AuthService
      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          // On successful login
          console.log('Login successful:', response);
          this.loading = false; // Reset loading flag
          this.router.navigate(['/home']); // Navigate to the home page
        },
        error: (error: HttpErrorResponse) => {
          // On login failure
          this.loading = false; // Reset loading flag
          if (error.error && error.error.message) {
            // Display backend provided error message
            this.errorMessage = error.error.message;
          } else {
            // Display a generic error message
            this.errorMessage = error.message || 'Login failed. Please try again.';
          }
          console.error('Login error:', error);
        }
      });
    } else {
      // If form is invalid, set a generic error message and mark all fields as touched
      this.errorMessage = 'Please enter both username and password.';
      this.markAllFormFieldsAsTouched(this.loginForm); // Show validation errors to the user
      this.loading = false;
    }
  }

  /**
   * Helper function to mark all form fields as touched.
   * This is useful to trigger validation messages on empty fields when the form is submitted.
   *
   * @param formGroup The FormGroup to iterate through.
   */
  private markAllFormFieldsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) { // Check if it's a nested FormGroup
        this.markAllFormFieldsAsTouched(control as FormGroup);
      }
    });
  }
}
