import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.example.com/login'; // Replace with actual API endpoint

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password })
      .pipe(
        catchError(error => {
          let errorMessage = 'An error occurred during login';
          if (error.status === 401) {
            errorMessage = 'Invalid username or password';
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}