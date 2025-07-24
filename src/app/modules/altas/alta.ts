import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';


import { ProductService } from '@core/services/product.service';
import { Product, ProductResponse } from './models/product.model';

@Component({
  selector: 'app-producto',
  imports: [CommonModule],
  templateUrl: './alta.html',
  styleUrl: './alta.css'
})
export class Altas implements OnInit, OnDestroy {
  constructor(private productService: ProductService) { }

  products: Product[] = [];

  // --- Lógica para Búsqueda Predictiva ---
  // Usamos un Subject para manejar el input de búsqueda
  // Esto nos permite emitir valores cada vez que el usuario escribe algo
  private searchSubject = new Subject<string>();

  // Usamos un Subject para manejar la destrucción del componente
  // Esto nos permite limpiar las suscripciones y evitar fugas de memoria
  // Cuando el componente se destruye, emitimos un valor y completamos el Subject
  // Esto es importante para evitar que el componente siga escuchando eventos
  // después de que haya sido destruido.
  // Esto es especialmente útil en aplicaciones Angular donde los componentes pueden ser creados y destruidos
  // dinámicamente, como en el caso de rutas o componentes modales.
  // Al usar un Subject, podemos asegurarnos de que no seguimos escuchando eventos
  //Piensa en destroy$ como el botón de apagado de emergencia de tu componente.
  private destroy$ = new Subject<void>();
  
  
  private currentSearchTerm: string = '';

  // Paginación
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 5;
  has_next = false;
  has_previous = false;

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

  /** Se llama en cada pulsación de tecla en el input de búsqueda */
  // Aquí usamos el Subject para emitir el valor del input de búsqueda
  // y luego lo procesamos en el ngOnInit para realizar la búsqueda.
  // Esto permite que la búsqueda se realice de manera reactiva,
  // actualizando los productos mostrados en la tabla cada vez que el usuario escribe algo.
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

  }

  deleteProduct(product: Product): void {

  }



  ngOnInit(): void {
    // Carga inicial de productos
    this.loadProducts(this.currentPage, this.pageSize, this.currentSearchTerm);

    // Suscripción al stream de búsqueda
    // Aquí nos suscribimos al Subject de búsqueda para recibir los términos de búsqueda
    // y realizar la búsqueda de productos.
    // Usamos takeUntil para asegurarnos de que nos desuscribimos cuando el componente
    // se destruye, evitando fugas de memoria.
    // También usamos debounceTime para esperar 300ms después de la última pulsación
    // y distinctUntilChanged para evitar búsquedas innecesarias si el término no ha cambiado
    // y filter para asegurarnos de que solo buscamos si el término tiene al menos 3 caracteres
    // o si el campo está vacío (para mostrar todos los productos).
    // Finalmente, usamos switchMap para cancelar cualquier petición anterior y lanzar una nueva
    // cuando el usuario escribe algo nuevo.
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

  // Nos desuscribimos del Subject al destruir el componente
  // Esto es importante para evitar fugas de memoria y asegurarnos de que no seguimos escuchando
  // eventos después de que el componente haya sido destruido.
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
