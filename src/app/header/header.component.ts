import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  
  constructor(public router: Router, public authService: AuthService,) { }

  ngOnInit(): void {

    
  }


  openLogin() {

  }

  openRegister() {
    
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
}
