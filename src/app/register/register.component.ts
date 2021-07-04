import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerSub: Subscription;
  form = this.fb.group({
    "fName": [null, Validators.required],
    "lName": [null, Validators.required],
    "email": [null, Validators.required],
    "password": [null, Validators.required],
    "confirmPassword": [null, Validators.required]
  });
  
  constructor(
    private _snackBar: MatSnackBar,
    public router: Router,
    public authService: AuthService,
    public fb: FormBuilder, 
  ) { }

  ngOnInit(): void {
  }

  register() {

    if (this.form.invalid) {
      console.log('Form Invalid');
      return
    }
    
    const email = this.form.value.email;
    const fName = this.form.value.fName;
    const lName = this.form.value.lName;
    const password = this.form.value.password;

    this.authService.register(email,password,fName,lName);
    this.registerSub = this.authService.getSignUpListener()
    .subscribe((result) => {
      this.registerSub.unsubscribe();
      if (result) {
        console.log('register successful');
        this.openSnackBar('Account created successfully','');
        this.router.navigate(['/']);
      } else {
        this.openSnackBar('Unable to register, please try again or contact support','');
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
