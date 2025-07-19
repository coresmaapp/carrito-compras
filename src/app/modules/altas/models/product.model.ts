export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: number;
  category_name: string;
  image_url: string | null;
  is_active: boolean;
  created_by: number;
  created_by_username: string;
  created_at: string;
  updated_at: string;
  available_stock: number;
}

export interface ProductResponse {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  results: Product[];
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: string;
  stock: number;
  category: number;
  image_url?: string;
  is_active: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  category?: number;
  image_url?: string;
  is_active?: boolean;
} 