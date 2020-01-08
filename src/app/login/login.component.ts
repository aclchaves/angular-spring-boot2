import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { userLogin } from '../dto/userLogin'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private userAuth: boolean = false;

  private userLogin: userLogin = new userLogin();

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.userLogin)
      .subscribe(res =>{
        //this.userLogin = res
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
        this.userAuth = true;

      },
      err => {
        this.userLogin = err;
        this.userAuth = false;
      });
  }

  cancel(){
    this.router.navigate(['/home']);
  }

  userAuthenticated() {
    return this.userAuth;
  }

}
