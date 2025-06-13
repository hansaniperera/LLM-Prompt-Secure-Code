import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: url },
      replaceUrl: true 
    });
    
    return false;
  }
}