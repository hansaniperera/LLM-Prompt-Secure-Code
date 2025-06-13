import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      // Example: Only allow 'admin' role to access
      if (this.auth.userRole() === 'admin') {
        return true;
      }
      this.router.navigate(['/unauthorized']);
      return false;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
