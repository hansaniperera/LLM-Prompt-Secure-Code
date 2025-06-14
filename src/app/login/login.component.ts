import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize the login form with form controls and validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username is required
      password: ['', Validators.required]  // Password is required
    });
  }

  /**
   * Handles the form submission for login.
   * Sends credentials to AuthService and navigates on success or shows error.
   */
  onSubmit(): void {
    this.errorMessage = ''; // Clear any previous error messages

    // Check if the form is valid
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Call the login method from AuthService
      this.authService.login(username, password).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/home']); // Navigate to home on successful login
          } else {
            this.errorMessage = 'Login failed. Please check your credentials.'; // Display error message
          }
        },
        error => {
          // Handle HTTP errors or other unexpected issues
          this.errorMessage = 'An error occurred during login. Please try again later.';
          console.error('Login error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please enter both username and password.'; // Display error if form is invalid
    }
  }
}