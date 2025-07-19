import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthModel } from './models/auth.model';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public userForm: FormGroup;
  public loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth) {

    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      password: ['', Validators.required]
    });

  }

  get form() {
    return this.userForm.controls;
  }


  login() {
    // Resetea el error en cada intento de login
    this.loginError = null;

    if(this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    }

    // ¡Importante! Usamos los valores del formulario reactivo, no de un modelo separado.
    const { username, password } = this.userForm.value;

    this.auth.login(username, password).subscribe({
      next: (response) => {
        console.log(response);
        // Aquí iría la lógica de éxito, como navegar al dashboard.
      },
      error: (error) => {
        // Cuando el servicio devuelve un error, mostramos el mensaje.
        this.loginError = error.error.detail;
        console.log(this.loginError);
        
        this.userForm.reset();
        console.log(error);
      }
    });
  }
}
