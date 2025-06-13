import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Logs out the user via the AuthService and navigates to the login page.
   */
  logout(): void {
    this.authService.logout();
  }
}