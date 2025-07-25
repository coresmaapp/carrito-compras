import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';


import { ProductService } from '@core/services/product.service';
import { Product, ProductResponse } from './models/product.model';

import { Form } from '@modules/altas/form/form';
import { Delete } from '@modules/altas/delete/delete';


@Component({
  selector: 'app-producto',
  imports: [CommonModule, Form, Delete],
  templateUrl: './alta.html',
  styleUrl: './alta.css'
})
export class Altas implements OnInit, OnDestroy {
  
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


  deleteProduct(product: Product): void {
    console.log('Eliminar producto:', product);
    this.user = product; // Asignamos el producto a eliminar a la variable user
    this.showDelete = true; // Mostramos el componente de eliminación
  }

  confirmDelete(data: any): void {
    this.showDelete = false; // Ocultamos el componente de eliminación
    this.user = {}; // Reseteamos los datos del usuario
    if (data.success) {
       this.message = data.message; // Actualizamos el mensaje
      this.showMessage = true; // Mostramos el mensaje
      this.loadProducts(this.currentPage, this.pageSize, this.currentSearchTerm); // Recargamos los productos
    }
  }

  showCreateForm(): void {
    console.log('Mostrar formulario de creación de producto');
    console.log('Datos del usuario:', this.user);
    this.user = {}; // Reseteamos los datos para el formulario de creación
    this.user.created_by = 1; // Aseguramos que el campo created_by esté presente
    
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  formDataEventModal(data: any): void {
    this.showMessage = true;
    this.message = data.message;

    this.showForm = false;
    this.loadProducts(this.currentPage, this.pageSize, this.currentSearchTerm);
  }


  closeMessage(): void {
    this.showMessage = false;
    this.message = '';
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
        return this.productService.getProducts(1, this.pageSize, this.currentSearchTerm);
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
