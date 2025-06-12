import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Required for reactive forms
import { HttpClientModule } from '@angular/common/http'; // Required for HTTP requests
import { AppRoutingModule } from './app-routing.module'; // Contains our routing configuration

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service'; // Our custom authentication service

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, // Import ReactiveFormsModule
    HttpClientModule // Import HttpClientModule
  ],
  providers: [AuthService], // Provide the AuthService
  bootstrap: [AppComponent]
})
export class AppModule { }