import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Required for reactive forms
import { HttpClientModule } from '@angular/common/http'; // For making HTTP requests (e.g., to a backend API)

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service'; // Import the AuthService

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, // Declare LoginComponent
    HomeComponent   // Declare HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule to imports
    HttpClientModule     // Add HttpClientModule to imports
  ],
  providers: [AuthService], // Provide AuthService at the root level
  bootstrap: [AppComponent]
})
export class AppModule { }
