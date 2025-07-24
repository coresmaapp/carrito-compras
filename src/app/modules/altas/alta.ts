import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ProductService } from '@core/services/product.service';
import { Product, ProductResponse } from './models/product.model';

@Component({
  selector: 'app-producto',
  imports: [CommonModule],
  templateUrl: './alta.html',
  styleUrl: './alta.css'
})
export class Altas implements OnInit {
  constructor(private productService: ProductService) { }

  products: Product[] = [];

  loadProducts(page: number = 1, pageSize: number = 10, search?: string): void {
    this.productService.getProducts(page, pageSize, search)
      .subscribe((response: ProductResponse) => {
        this.products = response.results;
      });
  }

  showEditForm(product: Product): void {

  }

  deleteProduct(product: Product): void {

  }



  ngOnInit(): void {
    this.loadProducts(1, 5, '');
  }


}
