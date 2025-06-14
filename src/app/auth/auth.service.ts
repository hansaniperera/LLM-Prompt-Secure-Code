// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

/**
 * Interface for the login credentials object.
 * Defines the structure of the data sent to the login API endpoint.
 */
interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interface for the login response object.
 * Defines the expected structure of the response from a successful login API call.
 */
interface LoginResponse {
  token: string; // Authentication token received from the backend
  message: string; // A descriptive message
  // You might include other user-related data here, e.g., userId, userRole
}

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Get API base URL from environment config
  private token: string | null = null; // Store the authentication token

  constructor(private http: HttpClient, private router: Router) {
    // Attempt to load token from local storage on service initialization
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Sends user credentials to the backend for authentication.
   *
   * @param credentials The username and password provided by the user.
   * @returns An Observable of the LoginResponse.
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    // Construct the full API endpoint for login
    const loginEndpoint = `${this.apiUrl}/login`; // e.g., http://localhost:3000/api/login

    return this.http.post<LoginResponse>(loginEndpoint, credentials)
      .pipe(
        // Use tap to perform side effects (like storing the token) without affecting the observable stream
        tap(response => {
          this.token = response.token; // Store the received token
          localStorage.setItem('authToken', response.token); // Persist token in local storage
          console.log('Login successful:', response.message);
        }),
        // Catch and re-throw any HTTP errors for components to handle
        catchError(this.handleError)
      );
  }

  /**
   * Logs out the current user by clearing the authentication token.
   */
  logout(): void {
    this.token = null; // Clear the token from memory
    localStorage.removeItem('authToken'); // Remove token from local storage
    this.router.navigate(['/login']); // Navigate back to the login page
    console.log('User logged out.');
  }

  /**
   * Checks if a user is currently authenticated.
   *
   * @returns True if a token exists, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!this.token; // Converts the token (string or null) to a boolean
  }

  /**
   * Retrieves the stored authentication token.
   *
   * @returns The authentication token string or null if not authenticated.
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Handles HTTP errors from API calls.
   *
   * @param error The HttpErrorResponse object.
   * @returns An Observable that throws an error message.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      console.error('Client-side error:', error.error.message);
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
      if (error.status === 401) {
        errorMessage = 'Invalid username or password.'; // Specific message for unauthorized
      } else if (error.error && error.error.message) {
        errorMessage = `Login failed: ${error.error.message}`; // Use backend message if available
      } else {
        errorMessage = `Server error: ${error.statusText || 'Unknown'}`;
      }
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errorMessage));
  }
}