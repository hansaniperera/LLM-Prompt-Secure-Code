// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-endpoint.com/auth/login';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap(() => this.router.navigate(['/home']))
    );
  }
}
