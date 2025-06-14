// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-endpoint.com/login';
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }) {
    return this.http.post(this.apiUrl, credentials).subscribe({
      next: () => {
        this.isAuthenticated.next(true);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isAuthenticated.next(false);
      }
    });
  }

  getAuthStatus() {
    return this.isAuthenticated.asObservable();
  }
}
