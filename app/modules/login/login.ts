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
    
    this.auth.login(this.username, this.password).subscribe((response) => {
      console.log(response);
    }, (error) => {
      this.username = '';
      this.password = '';
      console.log(error);
    });
  }
}
