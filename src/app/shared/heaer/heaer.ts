import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth';



@Component({
  selector: 'app-heaer',
  imports: [RouterModule],
  templateUrl: './heaer.html',
  styleUrl: './heaer.css'
})
export class Heaer implements OnInit {

  private auth = inject(Auth);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!this.auth.accessToken;
  }



  public logout() {
    this.auth.clearStorage;
    this.router.navigate(['/login']);
  }

  
  ngOnInit(): void {
    
  }

}
