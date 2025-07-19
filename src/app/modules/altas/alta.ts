import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from './services/product.service';
import { Product, ProductResponse, CreateProductRequest, UpdateProductRequest } from './models/product.model';

@Component({
  selector: 'app-producto',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './alta.html',
  styleUrl: './alta.css'
})
export class Altas implements OnInit, OnDestroy {
  // Datos de productos
  products: Product[] = [];
  currentProduct: Product | null = null;
  isLoading = false;
  errorMessage = '';
  
  // Paginación
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 10;
  has_next = false;
  has_previous = false;
  
  // Estados de UI
  showForm = false;
  isEditing = false;
  searchTerm = '';
  
  // Formulario
  productForm: FormGroup;
  
  // Categorías (hardcodeadas por ahora, idealmente vendrían de un servicio)
  categories = [
    { id: 1, name: 'Electrónica' },
    { id: 2, name: 'Ropa' },
    { id: 3, name: 'Libros' },
    { id: 4, name: 'Hogar' },
    { id: 5, name: 'Deportes' },
    { id: 6, name: 'Otros' }
  ];
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: [1, [Validators.required]],
      image_url: [''],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts(this.currentPage, this.pageSize, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ProductResponse) => {
          this.products = response.results;
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
          this.totalItems = response.count;
          this.has_next = response.has_next;
          this.has_previous = response.has_previous;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar los productos';
          this.isLoading = false;
          console.error('Error loading products:', error);
        }
      });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  showCreateForm(): void {
    this.isEditing = false;
    this.currentProduct = null;
    this.productForm.reset({
      name: '',
      description: '',
      price: '',
      stock: 0,
      category: 1,
      image_url: '',
      is_active: true
    });
    this.showForm = true;
  }

  showEditForm(product: Product): void {
    this.isEditing = true;
    this.currentProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image_url: product.image_url || '',
      is_active: product.is_active
    });
    this.showForm = true;
  }

  hideForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentProduct = null;
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const formData = this.productForm.value;

      if (this.isEditing && this.currentProduct) {
        // Actualizar producto
        const updateData: UpdateProductRequest = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          image_url: formData.image_url || null,
          is_active: formData.is_active
        };

        this.productService.updateProduct(this.currentProduct.id, updateData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadProducts();
              this.hideForm();
              this.isLoading = false;
            },
            error: (error) => {
              this.errorMessage = 'Error al actualizar el producto';
              this.isLoading = false;
              console.error('Error updating product:', error);
            }
          });
      } else {
        // Crear nuevo producto
        const createData: CreateProductRequest = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          image_url: formData.image_url || undefined,
          is_active: formData.is_active
        };

        this.productService.createProduct(createData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadProducts();
              this.hideForm();
              this.isLoading = false;
            },
            error: (error) => {
              this.errorMessage = 'Error al crear el producto';
              this.isLoading = false;
              console.error('Error creating product:', error);
            }
          });
      }
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`)) {
      this.isLoading = true;
      this.productService.deleteProduct(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadProducts();
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error al eliminar el producto';
            this.isLoading = false;
            console.error('Error deleting product:', error);
          }
        });
    }
  }

  toggleProductStatus(product: Product): void {
    this.productService.toggleProductStatus(product.id, !product.is_active)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage = 'Error al cambiar el estado del producto';
          console.error('Error toggling product status:', error);
        }
      });
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
    return `$${parseFloat(price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Método para acceder a Math desde el template
  get Math() {
    return Math;
  }
}
