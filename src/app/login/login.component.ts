import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorText = '';

  emailPattern = `[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-z]{2,4}$`;

  loadingText = '';

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.submitted = true;

    this.loadingText = 'Please wait...';
    this.spinner.show();
    this.authService.login(this.loginForm.value).subscribe((response) => {
      this.spinner.hide();
      if (response.status === 'success') {
        localStorage.setItem('token', response.token);
        this.router.navigate(['home']);
      } else {
        this.errorText = 'Something went wrong. Please try again later.';
      }
    });
  }
}
