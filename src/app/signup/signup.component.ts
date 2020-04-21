import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registrationForm: FormGroup;
  submitted = false;
  errorText = '';

  emailPattern = `[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-z]{2,4}$`;
  phoneNumberPattern = `^01[3,4,5,6,7,8,9][0-9]{8}$`;

  loadingText = '';

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
        phone: ['', [Validators.required]],
        hospital: ['', [Validators.required]],
      },
      { validator: this.matchPassword }
    );
  }

  onSubmit() {
    this.submitted = true;

    this.loadingText = 'Please wait...';
    this.spinner.show();
    this.authService.signup(this.registrationForm.value).subscribe((response) => {
      this.spinner.hide();
      if (response.status === 'success') {
        this.router.navigate(['login']);
      } else {
        this.errorText = 'Something went wrong. Please try again later.';
      }
    });
  }

  matchPassword(control: AbstractControl) {
    let password = control.get('password').value;
    let passwordConfirm = control.get('passwordConfirm').value;

    if (password != passwordConfirm) {
      control.get('passwordConfirm').setErrors({ passwordConfirm: true });
    } else {
      return null;
    }
  }
}
