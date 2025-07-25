import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductService } from '@core/services/product.service';
import { CreateProductRequest } from '@modules/altas/models/product.model';

@Component({
  selector: 'app-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form {
   @Input() data: any = {};
   @Output() confirmEvent = new EventEmitter();
   @Output() FormEvent = new EventEmitter();


  form: FormGroup;
  categories: any[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' }
  ];


  product: CreateProductRequest = {
    name: '',
    description: '',
    price: '',
    stock: 0,
    category: 0,
    image_url: '',
    is_active: true,
    created_by: 0
  };

  constructor(private productService: ProductService, private fb: FormBuilder) {



    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image_url: ['', Validators.required],
      is_active: [true, Validators.required],
      created_by: [0, Validators.required] // ← Usamos el dato recibido
    });
   }

   get productForm(){
    return this.form.controls;
   }
   

   onSubmit(): void {

    if (this.form.valid) {
      this.productService.createProduct(this.form.value)
        .subscribe({
          next: (response) => {
            console.log('Producto creado exitosamente:', response);
            this.form.reset();
            this.FormEvent.emit({ success: true, message: 'Producto creado exitosamente' });
          },
          error: (error) => {
            console.error('Error al crear el producto:', error);
          }
        });
    } else {
      alert('Por favor, completa todos los campos requeridos correctamente.');
    }
  }

  onCancel(): void {
    this.form.reset();
    this.confirmEvent.emit(false);
  }

  ngOnInit() {
    console.log('ID del usuario recibido:', this.data);
    this.product.created_by = this.data.id || 0; // Asignar el ID del usuario al campo created_by
    this.form.patchValue({
      created_by: this.product.created_by
    });
  }

}
