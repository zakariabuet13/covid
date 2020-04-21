import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropDirective } from './drag-n-drop.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Constants } from './constants';

@NgModule({
  declarations: [AppComponent, DragDropDirective, LoginComponent, SignupComponent, HomeComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    HttpClientModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [Constants.apiUrl],
        blacklistedRoutes: [`${Constants.apiUrl}/signup`, `${Constants.apiUrl}/login`],
      },
    }),
  ],
  providers: [NgxSpinnerService, AuthService, AuthGuard, JwtHelperService],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function tokenGetter() {
  return localStorage.getItem('token');
}
