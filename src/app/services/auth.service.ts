import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { LoginCredentials, User } from '../models/user.model';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'asset_management_token';
  private userKey = 'asset_management_user';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    const storedUser = localStorage.getItem(this.userKey);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials)
      .pipe(
        tap(response => {
          if (response.success && response.user && response.token) {
            this.setToken(response.token);
            this.setUser(response.user);
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  public getUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  refreshToken(): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/refresh', {})
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setToken(response.token);
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
}