import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Spinner } from './shared/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'carrito';
}
