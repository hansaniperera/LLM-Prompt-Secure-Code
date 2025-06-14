// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.your-domain.com/auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }) {
    return this.http.post<{ token: string }>(this.apiUrl, credentials).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
