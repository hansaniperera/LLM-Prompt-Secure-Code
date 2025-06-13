import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A simple flag to simulate login state
  private loggedIn = false;

  constructor(private router: Router) { }

  /**
   * Simulates a login API call.
   * In a real application, you would use HttpClient to make an actual
   * HTTP POST request to your backend API endpoint.
   *
   * @param username The username provided by the user.
   * @param password The password provided by the user.
   * @returns An Observable<boolean> indicating login success or failure.
   */
  login(username: string, password: string): Observable<boolean> {
    // Simulate a network request delay
    return of(null).pipe(
      delay(1000), // Simulate 1 second delay
      tap(() => {
        // Mock authentication logic:
        // Assume 'admin'/'password' is a valid credential.
        if (username === 'admin' && password === 'password') {
          this.loggedIn = true;
          console.log('Login successful for user:', username);
        } else {
          this.loggedIn = false;
          console.error('Login failed for user:', username);
          throw new Error('Invalid credentials'); // Propagate error for failed login
        }
      })
    );
  }

  /**
   * Checks if the user is currently logged in.
   * In a real application, this might check for a valid token in localStorage/sessionStorage.
   */
  isLoggedIn(): boolean {
    // For a real app, you'd check a token here, e.g., localStorage.getItem('authToken') != null
    return this.loggedIn;
  }

  /**
   * Logs out the user and navigates back to the login page.
   */
  logout(): void {
    this.loggedIn = false;
    // In a real app, clear tokens from localStorage/sessionStorage
    // localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
    console.log('User logged out.');
  }
}
