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
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string;
  showPassword = false;

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

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to home
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  // Convenience getter for easy access to form fields
  get f() { 
    return this.loginForm.controls; 
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
      username: this.f['username'].value.trim(),
      password: this.f['password'].value
    };

    this.authService.login(credentials)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.error = response.message || 'Login failed. Please try again.';
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.status === 401) {
            this.error = 'Invalid username or password.';
          } else if (error.status === 0) {
            this.error = 'Unable to connect to server. Please check your connection.';
          } else {
            this.error = error.error?.message || 'An error occurred during login. Please try again.';
          }
          this.loading = false;
        }
      });
  }

  clearError(): void {
    this.error = '';
  }
}