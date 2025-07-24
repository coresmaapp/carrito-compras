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


  // Paginación
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 5;
  has_next = false;
  has_previous = false;

  // Método para obtener los números de página para la paginación
  getPageNumbers(): number[] {
    const pages: number[] = [];

    //centrar el bloque de páginas alrededor de la página actual (2 páginas antes y después)
    
    // Asegurarse de que no se salga de los límites
    // Math.max Para evitar que el valor de start sea menor que 1, lo cual no tendría sentido en una paginación (no existe la página 0 o negativa).
    const start = Math.max(1, this.currentPage - 2);

    // Math.min Para evitar que el valor de end sea mayor que el número total de páginas, lo cual podría causar un error al intentar acceder a una página que no existe.
    // Esto asegura que el bloque de páginas no se extienda más allá del número total de páginas disponibles.
    // Por ejemplo, si hay 5 páginas y estás en la página 5, end no debería ser 7, sino 5.
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }


  // Método para manejar el cambio de página
  // Este método se llama cuando el usuario hace clic en un botón de paginación
  // Se asegura de que la página solicitada esté dentro de los límites válidos
  // y luego carga los productos correspondientes a esa página.
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts(page, this.pageSize, '');
    }
  }


  loadProducts(page: number, pageSize: number, search?: string): void {
    this.productService.getProducts(page, pageSize, search)
      .subscribe((response: ProductResponse) => {
        this.products = response.results;

        // paginación
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.totalItems = response.count;
        this.has_next = response.has_next;
        this.has_previous = response.has_previous;
      });
  }


  showEditForm(product: Product): void {

  }

  deleteProduct(product: Product): void {

  }



  ngOnInit(): void {
    this.loadProducts(this.currentPage, this.pageSize, '');
  }


}
