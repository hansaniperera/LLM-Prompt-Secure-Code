import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private loginUrl = 'https://your-api.com/api/login'; // Replace with real API

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      }),
      catchError((err) => {
        return throwError(() => new Error(err.error.message || 'Login failed'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
