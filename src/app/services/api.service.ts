import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentials, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials, { headers });
  }

  // Mock login for demonstration (remove when backend is ready)
  mockLogin(credentials: LoginCredentials): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'password') {
          observer.next({
            success: true,
            message: 'Login successful',
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@assetmanagement.com',
              firstName: 'Admin',
              lastName: 'User',
              role: 'administrator'
            },
            token: 'mock-jwt-token-12345'
          });
        } else {
          observer.next({
            success: false,
            message: 'Invalid username or password'
          });
        }
        observer.complete();
      }, 1000); // Simulate network delay
    });
  }
}