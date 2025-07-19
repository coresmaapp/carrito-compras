import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Product, ProductResponse, CreateProductRequest, UpdateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.API_URL}api/shoppingcart/products/`;

  constructor(private http: HttpClient) { }

  // Obtener todos los productos con paginación
  getProducts(page: number = 1, pageSize: number = 10, search?: string): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  // Obtener un producto por ID
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}/`);
  }

  // Crear un nuevo producto
  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Actualizar un producto
  updateProduct(id: number, product: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${id}/`, product);
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Cambiar estado activo/inactivo
  toggleProductStatus(id: number, isActive: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}${id}/`, { is_active: isActive });
  }
} 