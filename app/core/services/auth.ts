import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post('api/api/token/', { username, password });
  }

  
}
