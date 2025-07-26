import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-delete',
  imports: [],
  templateUrl: './delete.html',
  styleUrl: './delete.css'
})
export class Delete implements OnInit {
  @Output() confirmEvent = new EventEmitter();
  @Input() data: any = {};

  constructor(private productService: ProductService) { }

  
  onCancel(): void {
    this.confirmEvent.emit({ success: false, message: 'Eliminación cancelada' });
  }


  onConfirm(): void {

    this.productService.deleteProduct(this.data.id).subscribe({
      next: () => {
        this.confirmEvent.emit({ success: true, message: 'Producto eliminado exitosamente' });
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.confirmEvent.emit({ success: false, message: 'Error al eliminar el producto' });
      } 
    });

  }

  ngOnInit(): void {
    console.log('ID del usuario recibido en Delete:', this.data);
  }

}
