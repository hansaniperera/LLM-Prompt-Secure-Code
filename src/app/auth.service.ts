import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A simple mock API endpoint for demonstration
  // In a real application, this would be your actual backend API URL
  private loginApiUrl = '/api/login';
  private loggedIn = false; // Simple state to track login status

  constructor(private http: HttpClient) { }

  /**
   * Simulates a login API call.
   * In a real application, this would send credentials to your backend.
   * @param credentials - Object containing username and password.
   * @returns An Observable indicating success or failure.
   */
  login(credentials: any): Observable<any> {
    // Simulate a successful login for 'user' with password 'password'
    if (credentials.username === 'user' && credentials.password === 'password') {
      this.loggedIn = true;
      // Simulate API delay
      return of({ success: true, message: 'Login successful!' }).pipe(delay(1000), tap(() => {
        // In a real app, you might store a token here (e.g., in localStorage)
        localStorage.setItem('authToken', 'mock-jwt-token');
      }));
    } else {
      this.loggedIn = false;
      // Simulate API delay for failed login
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }

    /*
    // Example of a real HTTP POST request to a backend API:
    return this.http.post<any>(this.loginApiUrl, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.loggedIn = true;
          localStorage.setItem('authToken', response.token); // Store authentication token
        } else {
          this.loggedIn = false;
        }
      })
    );
    */
  }

  /**
   * Checks if the user is currently logged in.
   * @returns A boolean indicating the login status.
   */
  isLoggedIn(): boolean {
    // In a real app, you would check for a valid token (e.g., from localStorage)
    return this.loggedIn || !!localStorage.getItem('authToken');
  }

  /**
   * Logs out the user.
   */
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('authToken'); // Remove authentication token
    // Navigate back to login page if needed (handled by Router)
  }
}