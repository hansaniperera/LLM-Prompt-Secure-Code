// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard'; // Import the AuthGuard

// Define application routes
const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route for the login page
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard] // Protect the home page with AuthGuard
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route redirects to login
  { path: '**', redirectTo: '/login' } // Wildcard route for any unknown paths, redirects to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure router for root application
  exports: [RouterModule] // Export RouterModule to make it available throughout the app
})
export class AppRoutingModule { }
