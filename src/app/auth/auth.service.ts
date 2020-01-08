import { Injectable, EventEmitter, Input  } from '@angular/core';

import { userLogin } from '../dto/userLogin';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly _login = "http://localhost:8080/auth/login";


  private userAuth: boolean = false;

  viewManuEmitter = new EventEmitter<boolean>();
  constructor(private http: HttpClient,
    private router: Router) { }

  login(user) {
    return this.http.post<any>(this._login, user);
  }

  userAuthenticated() {
    return this.userAuth;
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }
  
  getToken() {
    return localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
