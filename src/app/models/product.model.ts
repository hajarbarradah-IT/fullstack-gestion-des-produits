// Interface Produit
export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock: number;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Statistiques des produits
export interface ProductStats {
  totalProducts: number;
  totalCategories: number;
  totalStock: number;
  stockValue: number;
  lowStockCount: number;
  outOfStock: number;
  productsByCategory: { name: string; color: string; count: number }[];
}
