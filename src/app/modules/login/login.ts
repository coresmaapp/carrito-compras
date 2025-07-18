import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthModel } from './models/auth.model';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private auth: Auth) {}

  public authModel: AuthModel = {
    username: '',
    password: ''
  };


  login() {

    console.log(this.authModel);
    
    
    this.auth.login(this.authModel.username, this.authModel.password).subscribe((response) => {
      console.log(response);
    }, (error) => {
      this.authModel.username = '';
      this.authModel.password = '';
      console.log(error);
    });
  }
}
