import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: 'root'})
export class AuthService {

    token: string;
    isAuthenticated = false;
    signupListener = new Subject<boolean>();
    loginListener = new Subject<boolean>();
    authStatusListener = new Subject<boolean>();
    editDetailsListener = new Subject<boolean>();
    resetPasswordListener = new Subject<boolean>();
    changedPasswordListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getResetPasswordListener() {
        return this.resetPasswordListener.asObservable();
    }

    getChangedPasswordListener() {
        return this.changedPasswordListener.asObservable();
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getSignUpListener() {  
        return this.signupListener.asObservable();
    }

    getLoginListener() {  
        return this.loginListener.asObservable();
    }

    getEditDetailsListener() {
        return this.editDetailsListener.asObservable();
    }

    register(email: string, password: string, fName: string, lName: string) {
        const authData = { email: email, password: password, fName: fName, lName: lName};
        this.http
        .post(BACKEND_URL + 'register', authData)
        .subscribe(response => {
            this.login(email,password); 
        }, error => {
            this.signupListener.next(false);
        });
    }

    login(emailAddress: string, password: string) {
        this.http
        .post<{ token: string, _id: string, fName: string, lName: string }>(
            BACKEND_URL + 'login', { email: emailAddress, password: password })
        .subscribe(response => {
            if (response.token) {
                this.token = response.token;
                this.isAuthenticated = true;
                this.signupListener.next(true);
                this.loginListener.next(true);
                this.saveAuthData(response.token,response._id,emailAddress,response.fName, response.lName);
                this.autoAuthUser(); 
            }
            }, error => {
                this.isAuthenticated = false;
                this.signupListener.next(false);
                this.loginListener.next(false);
                this.authStatusListener.next(false); 
        });
    }

    editDetails(fName: string, lName: string) {
        const userData = {fName: fName, lName: lName};
        this.http
        .post(BACKEND_URL + 'edit-user-details',userData)
        .subscribe(response => {
            this.editDetailsListener.next(true);
            localStorage.setItem('fName',fName);
            localStorage.setItem('lName',lName);
        }, error => {
            this.editDetailsListener.next(false);
        });
    }

    autoAuthUser() {
        const authInformation =  this.getAuthData();
        if(!authInformation) {
            return;
        }
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
     }

     getAuthData() {
        
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        const fName = localStorage.getItem('fName');
        const lName = localStorage.getItem('lName');

        if ( !token || !userId) {
            return;
        } 

        return {
            token: token,
            userId: userId,
            email: email,
            fName: fName,
            lName: lName
        }
    }

    saveAuthData(token: string, userId: string, email: string, fName: string, lName: string) {
        localStorage.setItem('token',token);
        localStorage.setItem('userId',userId);
        localStorage.setItem('email',email);
        localStorage.setItem('fName',fName);
        localStorage.setItem('lName',lName);
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        localStorage.clear();
        this.router.navigate(['/']);
    }

    resetPassword(email: string) {
        this.http
        .post(BACKEND_URL + 'reset', {email: email})
        .subscribe(response => {
            console.log('successful');
            this.resetPasswordListener.next(true);
        }, error => {
            console.log('error');
            this.resetPasswordListener.next(false);
        });
    }

    changePassword(token: string, password: string) {
        this.http
        .post(BACKEND_URL + 'change-password', {token: token, password: password})
        .subscribe(response => {
            this.changedPasswordListener.next(true);
            console.log('password changed successfully');
        }, error => {
            this.changedPasswordListener.next(false);
            console.log('error changing password');
        });
    }
}