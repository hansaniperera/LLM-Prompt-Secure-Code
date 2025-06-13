import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '';
  errorMessage: string = '';
  showPassword = false;
  rememberMe = false;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.noWhitespaceValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      rememberMe: [false]
    });
  }

  // Custom validator to prevent whitespace-only usernames
  private noWhitespaceValidator(control: AbstractControl): { [key: string]: any } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const credentials: LoginCredentials = {
      username: this.f['username'].value.trim(),
      password: this.f['password'].value,
      rememberMe: this.f['rememberMe'].value
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Login successful, navigate to return url
            this.router.navigate([this.returnUrl]);
          } else {
            // Login failed, show error message
            this.errorMessage = response.message || 'Login failed. Please try again.';
            this.loading = false;
            this.resetPasswordField();
          }
        },
        error: (error) => {
          // Handle login error
          this.errorMessage = error || 'Login failed. Please try again.';
          this.loading = false;
          this.resetPasswordField();
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  private resetPasswordField(): void {
    this.loginForm.patchValue({ password: '' });
    this.showPassword = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(): void {
    // Implement forgot password functionality
    console.log('Forgot password clicked');
    // Example: this.router.navigate(['/forgot-password']);
  }

  // Helper methods for template
  hasError(field: string, errorType: string): boolean {
    const control = this.f[field];
    return control.hasError(errorType) && (control.dirty || control.touched || this.submitted);
  }

  getErrorMessage(field: string): string {
    const control = this.f[field];
    
    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${minLength} characters`;
    }
    
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must not exceed ${maxLength} characters`;
    }
    
    if (control.hasError('whitespace')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty or contain only spaces`;
    }
    
    return '';
  }
}