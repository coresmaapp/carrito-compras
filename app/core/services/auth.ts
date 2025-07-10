import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor() { }

  isAuthenticated = false;

  login(user: string, pass: string): boolean {
    this.isAuthenticated = true;
    return this.isAuthenticated;
  }
}
