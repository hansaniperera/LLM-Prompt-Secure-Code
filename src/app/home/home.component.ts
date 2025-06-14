// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // In a real application, you might fetch initial data here
    console.log('Welcome to the home page!');
  }

  /**
   * Logs out the user and navigates to the login page.
   */
  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
  }
}
