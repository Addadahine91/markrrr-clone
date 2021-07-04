import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'markrrrClone';
  isAuthenticated = false;
  isOpen = false;
  screenWidth: any;
  authListenerSubs: Subscription;

  toggleNavbar() {
    this.isOpen = !this.isOpen;
  }

  isMobile() {
    if (this.screenWidth <= 450) {
      return true;
    } else {
     return false;
    }
  }

  constructor(
    public authService: AuthService) {}

  ngOnInit() {

    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated; 
    });

    this.authService.autoAuthUser(); 
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.screenWidth = window.innerWidth;
    }
}
