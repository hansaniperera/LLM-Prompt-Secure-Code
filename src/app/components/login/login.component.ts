import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  errorMessage = '';
  private destroy$ = new Subject<void>();

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

    // Get return url from route parameters or default to home
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.errorMessage = response.message || 'Login failed';
            this.loading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
  }

  clearError(): void {
    this.errorMessage = '';
  }
}