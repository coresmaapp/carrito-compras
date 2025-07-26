import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';


import { ProductService } from '@core/services/product.service';
import { Product, ProductResponse } from '@modules/altas/models/product.model';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List implements OnInit {

  constructor(private productService: ProductService) {
     }
  
    products: Product[] = [];
  
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();
    private currentSearchTerm: string = '';
  
    // Paginación
    currentPage = 1;
    totalPages = 1;
    totalItems = 0;
    pageSize = 5;
    has_next = false;
    has_previous = false;
  
    showForm: boolean = false;
    user: any = {};
  
    showMessage: boolean = false;
    message: string = '';
  
    showDelete: boolean = false;
  
    getPageNumbers(): number[] {
      const pages: number[] = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  
  
    onPageChange(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadProducts(page, this.pageSize, this.currentSearchTerm);
      }
    }
  
  
    loadProducts(page: number, pageSize: number, search?: string): void {
      this.productService.getProductPublic(page, pageSize, search)
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
  
    onSearchInput(searchTerm: string): void {
      this.searchSubject.next(searchTerm);
    }
  
    getStockBadgeClass(stock: number): string {
      if (stock === 0) return 'stock-out';
      if (stock <= 5) return 'stock-low';
      if (stock <= 15) return 'stock-medium';
      return 'stock-high';
    }
  
    getStatusBadgeClass(isActive: boolean): string {
      return isActive ? 'status-active' : 'status-inactive';
    }
  
    getStatusText(isActive: boolean): string {
      return isActive ? 'Activo' : 'Inactivo';
    }
  
    formatPrice(price: string): string {
      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber)) {
        return price;
      }
      return `$${priceNumber.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  
  
  showEditForm(product: Product): void {
    console.log('Mostrar formulario de edición para el producto:', product);
    this.showForm = true;
    // Creamos un nuevo objeto con las propiedades del producto + la nueva propiedad
    this.user = { ...product, isEdit: true }; 
  }
  
  

  
  
    ngOnInit(): void {
      // Carga inicial de productos
      this.loadProducts(this.currentPage, this.pageSize, this.currentSearchTerm);
  
      this.searchSubject.pipe(
        takeUntil(this.destroy$),// Nos desuscribimos al destruir el componente
        debounceTime(300), // Espera 300ms después de la última pulsación
        distinctUntilChanged(), // Solo emite si el valor ha cambiado; Si el usuario borra una letra y la vuelve a escribir rápidamente), este filtro lo bloquea para no hacer la misma petición dos veces seguidas.
        filter(term => term.length === 0 || term.length > 2), // Condición de 3+ caracteres o campo vacío
        switchMap(searchTerm => {// Usamos switchMap para cancelar la petición anterior y lanzar una nueva
          this.currentSearchTerm = searchTerm.trim(); // Guardamos el término para la paginación
          // Cancela la petición anterior y lanza una nueva
          return this.productService.getProductPublic(1, this.pageSize, this.currentSearchTerm);
        })
      ).subscribe(response => {
        this.products = response.results;
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.totalItems = response.count;
        this.has_next = response.has_next;
        this.has_previous = response.has_previous;
      });
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

}
