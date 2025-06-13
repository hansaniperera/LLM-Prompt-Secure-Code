import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginCredentials, LoginResponse, User, AuthTokens } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = environment.tokenStorageKey;
  private readonly userKey = environment.userStorageKey;
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private refreshTokenTimeout?: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Start refresh token timer if user is logged in
    if (storedUser && this.getStoredToken()) {
      this.startRefreshTokenTimer();
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.getStoredToken();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (response.success && response.user && response.token) {
            this.setSession(response.user, {
              token: response.token,
              refreshToken: response.refreshToken,
              expiresIn: response.expiresIn
            });
            this.startRefreshTokenTimer();
          }
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    this.clearSession();
    this.stopRefreshTokenTimer();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => 'No refresh token available');
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map(response => {
          if (response.success && response.user && response.token) {
            this.setSession(response.user, {
              token: response.token,
              refreshToken: response.refreshToken,
              expiresIn: response.expiresIn
            });
            this.startRefreshTokenTimer();
          } else {
            this.logout();
          }
          return response;
        }),
        catchError(error => {
          this.logout();
          return this.handleError(error);
        })
      );
  }

  getToken(): string | null {
    return this.getStoredToken();
  }

  private setSession(user: User, tokens: AuthTokens): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
      localStorage.setItem(this.tokenKey, tokens.token);
      
      if (tokens.refreshToken) {
        localStorage.setItem('refresh_token', tokens.refreshToken);
      }
      
      if (tokens.expiresIn) {
        const expiresAt = new Date().getTime() + (tokens.expiresIn * 1000);
        localStorage.setItem('expires_at', expiresAt.toString());
      }
    }
    
    this.currentUserSubject.next(user);
  }

  private clearSession(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires_at');
    }
  }

  private getStoredUser(): User | null {
    if (this.isLocalStorageAvailable()) {
      const storedUser = localStorage.getItem(this.userKey);
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  }

  private getStoredToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private getStoredRefreshToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  private startRefreshTokenTimer(): void {
    if (!this.isLocalStorageAvailable()) return;
    
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) return;

    const expires = new Date(parseInt(expiresAt));
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
    
    if (timeout > 0) {
      this.refreshTokenTimeout = timer(timeout).pipe(
        switchMap(() => this.refreshToken())
      ).subscribe();
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      this.refreshTokenTimeout.unsubscribe();
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Invalid username or password. Please try again.';
          break;
        case 403:
          errorMessage = 'Access forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Login service not found. Please contact support.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case 429:
          errorMessage = 'Too many login attempts. Please try again later.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Authentication Error:', error);
    return throwError(() => errorMessage);
  }
}