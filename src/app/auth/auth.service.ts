import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Using Angular Signals for reactive auth state
  isAuthenticated = signal<boolean>(false);
  userRole = signal<string | null>(null);

  private apiUrl = 'https://api.example.com/auth/login'; // Must be HTTPS in production

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    // Credentials sent withCredentials:true for HTTP-only cookie
    return this.http.post<{ role: string }>(this.apiUrl, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          this.isAuthenticated.set(true);
          this.userRole.set(response.role);
        })
      );
  }

  logout() {
    // Backend should clear the cookie
    this.http.post('https://api.example.com/auth/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.isAuthenticated.set(false);
        this.userRole.set(null);
        this.router.navigate(['/login']);
      });
  }

  checkSession() {
    // Call this on app init to restore session if cookie is valid
    return this.http.get<{ authenticated: boolean, role: string }>('https://api.example.com/auth/session', { withCredentials: true })
      .pipe(
        tap(res => {
          this.isAuthenticated.set(res.authenticated);
          this.userRole.set(res.role);
        })
      );
  }
}
