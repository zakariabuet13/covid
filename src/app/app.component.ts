import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import * as tf from '@tensorflow/tfjs';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
