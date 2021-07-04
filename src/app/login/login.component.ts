import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginSub: Subscription;
  form = this.fb.group({
    "email": [null, Validators.required],
    "password": [null, Validators.required],
  });
  
  constructor(
    private _snackBar: MatSnackBar,
    public router: Router,
    public authService: AuthService,
    public fb: FormBuilder, 
  ) { }

  ngOnInit(): void {
  }

  login() {

    if (this.form.invalid) {
      console.log('Form Invalid');
      return
    }
    
    console.log('login');
    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authService.login(email,password);
    this.loginSub = this.authService.getLoginListener()
    .subscribe((result) => {
      this.loginSub.unsubscribe();
      if (result) {
        console.log('login successful');
        this.openSnackBar('Login successful','');
        this.router.navigate(['/']);
      } else {
        this.openSnackBar('Unable to login, please try again or contact support','');
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
