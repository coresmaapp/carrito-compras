import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';



import { Spinner as SpinnerService } from '../../core/services/spinner';


@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css'
})
export class Spinner {

  constructor(public spinner: SpinnerService){
  }

}
