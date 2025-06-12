import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get return url from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  // Convenience getter for easy access to form fields
  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials: LoginCredentials = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Login successful, navigate to return url
            this.router.navigate([this.returnUrl]);
          } else {
            // Login failed, show error message
            this.error = response.message || 'Login failed. Please try again.';
            this.loading = false;
          }
        },
        error: (error) => {
          // Handle login error
          this.error = error.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }

  // Method to clear error message
  clearError(): void {
    this.error = '';
  }
}