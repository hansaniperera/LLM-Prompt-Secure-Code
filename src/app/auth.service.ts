import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // 'of' for placeholder, will replace with real API call
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false; // Simple flag for demonstration
  private apiUrl = 'https://api.example.com/login'; // Placeholder API URL

  constructor(private http: HttpClient) { }

  /**
   * Logs in a user by sending credentials to the backend.
   * @param username The user's username.
   * @param password The user's password.
   * @returns An Observable indicating login success or failure.
   */
  login(username: string, password: string): Observable<boolean> {
    // In a real application, you would send these credentials to a backend API.
    // For now, we'll simulate a successful login after a delay.
    console.log('Attempting to log in with:', username, password);

    // Simulate API call
    return this.http.post<{ success: boolean; token?: string }>(this.apiUrl, { username, password })
      .pipe(
        tap(response => {
          if (response.success) {
            this.loggedIn = true;
            console.log('Login successful! Token:', response.token);
            // In a real app, store the token (e.g., in localStorage)
            // localStorage.setItem('authToken', response.token);
          } else {
            this.loggedIn = false;
            console.error('Login failed: Invalid credentials');
          }
        }),
        catchError(error => {
          this.loggedIn = false;
          console.error('Login API error:', error);
          // Return false on any API error
          return of(false);
        })
      );
  }

  /**
   * Checks if the user is currently logged in.
   * @returns A boolean indicating the login status.
   */
  isLoggedIn(): boolean {
    // In a real application, you might check for a valid token in localStorage
    // return !!localStorage.getItem('authToken');
    return this.loggedIn;
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.loggedIn = false;
    // In a real application, remove the token from storage
    // localStorage.removeItem('authToken');
    console.log('User logged out.');
  }
}