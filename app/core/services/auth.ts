import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

  set refreshToken(token: string)
  {
    localStorage.setItem('refreshToken', token);
  }
  
  get refreshToken(): string
  {
    return localStorage.getItem('refreshToken') ?? '';
  }

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post('api/api/token/', { username, password }).pipe(
      tap((response: any) => {
        this.accessToken = response.access;
        this.refreshToken = response.refresh;
      })
    );
  }

  
}
