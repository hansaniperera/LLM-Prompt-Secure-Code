// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Required for reactive forms
import { HttpClientModule } from '@angular/common/http'; // Required for HTTP client

import { AppRoutingModule } from './app-routing.module'; // Our routing module
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component'; // Import LoginComponent
import { HomeComponent } from './home/home.component'; // Import HomeComponent

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, // Declare LoginComponent
    HomeComponent   // Declare HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule here
    HttpClientModule     // Add HttpClientModule here
  ],
  providers: [], // Services like AuthService are 'providedIn: root' so don't need explicit listing here
  bootstrap: [AppComponent]
})
export class AppModule { }
