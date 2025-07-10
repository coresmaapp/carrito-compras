import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) { }

  login(user: string, pass: string) {
    return this.http.post('https://softder.com/api/token/', { user, pass });
  }

  
}
