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
  loginForm!: FormGroup; // Form group for the login form
  errorMessage: string | null = null; // To display login errors

  constructor(
    private fb: FormBuilder, // FormBuilder for reactive forms
    private authService: AuthService, // Service for authentication logic
    private router: Router // Router for navigation
  ) { }

  ngOnInit(): void {
    // Initialize the login form with form controls and validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username field, required
      password: ['', Validators.required]  // Password field, required
    });
  }

  /**
   * Handles the form submission for login.
   * Sends credentials to the authentication service.
   */
  onSubmit(): void {
    this.errorMessage = null; // Clear previous error messages

    // Check if the form is valid
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Call the login method from AuthService
      this.authService.login(username, password).subscribe({
        next: (success) => {
          // If login is successful, navigate to the home page
          if (success) {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          // If login fails, display a generic error message
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid username or password. Please try again.';
        }
      });
    } else {
      // If form is invalid (e.g., empty fields), display a message
      this.errorMessage = 'Please enter both username and password.';
    }
  }
}
