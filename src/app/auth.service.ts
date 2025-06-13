import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpClient
import { Observable, throwError, of } from 'rxjs'; // Make sure 'of' is imported
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Inject HttpClient here
  constructor(private http: HttpClient) { }

  /**
   * Mocks a backend API login call using HttpClient.
   * @param username The user's username.
   * @param password The user's password.
   * @returns An Observable that resolves to true on successful login or throws an error on failure.
   */
  login(username: string, password: string): Observable<boolean> {
    // Now genuinely using HttpClient to make a POST request
    return this.http.post<any>('/api/login', { username, password })
      .pipe(
        tap(() => {
          console.log('HttpClient login successful for:', username);
          localStorage.setItem('isLoggedIn', 'true'); // Simple mock token
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('HttpClient login failed:', error);
          let errorMessage = 'An unknown error occurred.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status) {
            errorMessage = `Login failed: Status ${error.status}`;
          }
          return throwError(() => new Error(errorMessage)); // Re-throw with custom error message
        }),
        // Map to true if successful, otherwise the error will be caught
        mergeMap(() => of(true)) // Return true on success. Use mergeMap to handle the inner observable from 'of(true)'.
      );
  }

  /**
   * Checks if the user is currently logged in.
   * In a real app, this would check for a valid token.
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  /**
   * Mocks logout functionality.
   */
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    console.log('User logged out.');
  }
}