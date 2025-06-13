import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

// Define the application routes
const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route for the login page
  { path: 'home', component: HomeComponent },   // Route for the home page
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route redirects to login
  { path: '**', redirectTo: '/login' } // Wildcard route for any other invalid path, redirects to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure the router at the root level
  exports: [RouterModule] // Export RouterModule to make router directives available globally
})
export class AppRoutingModule { }
