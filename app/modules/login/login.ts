import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private auth: Auth) {}

  login() {
    this.auth.login('admin', '123456').subscribe((response) => {
      console.log(response);
    });
  }
}
