import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editSub: Subscription;
  form = this.fb.group({
    "fName": [this.authService.getAuthData().fName, Validators.required],
    "lName": [this.authService.getAuthData().lName, Validators.required],
    "email": [this.authService.getAuthData().email, Validators.required],
  });
  
  constructor(
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder, 
  ) { }

  ngOnInit(): void {
    this.form.controls['email'].disable();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  submit() {
    this.authService.editDetails(this.form.value.fName, this.form.value.lName);
    this.editSub = this.authService.getEditDetailsListener()
    .subscribe((result) => {
      if (result) {
        this.openSnackBar('Profile updated','');
      } else {
        this.openSnackBar('Unable to update profile','');
      }
    });
  }

}