import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    this.isLoggedInSubject.next(!!token);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('https://your-backend-api.com/api/login', { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('accessToken', response.token);
          this.isLoggedInSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.isLoggedInSubject.next(false);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';
    if (error.error && error.error.message) {
      errorMsg = error.error.message;
    }
    return throwError(() => errorMsg);
  }
}
