import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private auth: Auth) {}

  public username: string = '';
  public password: string = '';

  login() {
    console.log(this.username, this.password);
    
    this.auth.login('admin', '123456').subscribe((response) => {
      console.log(response);
    });
  }
}
