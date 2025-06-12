import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = 'User'; // Placeholder for username, would typically come from auth data

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // In a real app, you might fetch user details here after successful login
  }

  /**
   * Handles the logout action.
   * Calls the AuthService to log out and navigates back to the login page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}