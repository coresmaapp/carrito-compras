import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


import { Heaer } from '../shared/heaer/heaer';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-layout',
  imports: [Heaer, Footer, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
