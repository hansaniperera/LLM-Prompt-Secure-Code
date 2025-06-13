import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Simulate API calls
    if (request.url.endsWith('/api/login') && request.method === 'POST') {
      const { username, password } = request.body;

      return of(null).pipe(
        delay(1000), // Simulate network latency
        mergeMap(() => {
          if (username === 'admin' && password === 'password') {
            // Simulate successful login
            return of(new HttpResponse({ status: 200, body: { message: 'Login successful' } }));
          } else {
            // Simulate failed login
            return throwError(() => new HttpErrorResponse({ status: 401, error: { message: 'Invalid credentials' } }));
          }
        })
      );
    }

    // Pass through other requests
    return next.handle(request);
  }
}