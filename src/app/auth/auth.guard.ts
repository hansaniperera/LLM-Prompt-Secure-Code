// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' // Makes the guard a singleton and available throughout the app
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines if a route can be activated.
   *
   * @param route The activated route snapshot.
   * @param state The router state snapshot.
   * @returns An Observable, Promise, or boolean indicating if activation is allowed.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isAuthenticated()) {
      // If user is authenticated, allow access to the route
      return true;
    } else {
      // If user is not authenticated, redirect to the login page
      console.log('Access denied. Redirecting to login...');
      return this.router.createUrlTree(['/login']); // Returns a UrlTree for redirection
    }
  }
}
