import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  set accessToken(token: string)
    {
        sessionStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return sessionStorage.getItem('accessToken') ?? '';
    }

  set refreshToken(token: string)
  {
    sessionStorage.setItem('refreshToken', token);
  }
  
  get refreshToken(): string
  {
    return sessionStorage.getItem('refreshToken') ?? '';
  }

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(`${environment.API_URL}api/token/`, { username, password }).pipe(
      tap((response: any) => {
        this.accessToken = response.access;
        this.refreshToken = response.refresh;
      })
    );
  }

  
}
