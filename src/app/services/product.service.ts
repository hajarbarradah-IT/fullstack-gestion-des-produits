import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductStats } from '../models/product.model';
import { environment } from '../../environments/environment';

interface ApiResponse<T> { success: boolean; message: string; data: T; }

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Liste des produits avec filtres optionnels
  getAll(filters?: { categoryId?: number; search?: string; lowStock?: boolean }): Observable<Product[]> {
    let params = new HttpParams();
    if (filters?.categoryId) params = params.set('categoryId', filters.categoryId.toString());
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.lowStock) params = params.set('lowStock', 'true');
    
    return this.http.get<ApiResponse<Product[]>>(this.API_URL, { params }).pipe(map(res => res.data));
  }

  // Récupérer un produit par ID
  getById(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.API_URL}/${id}`).pipe(map(res => res.data));
  }

  // Produits en stock faible
  getLowStock(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.API_URL}/low-stock`).pipe(map(res => res.data));
  }

  // Statistiques
  getStats(): Observable<ProductStats> {
    return this.http.get<ApiResponse<ProductStats>>(`${this.API_URL}/stats`).pipe(map(res => res.data));
  }

  // Créer un produit (Admin)
  create(product: Product): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.API_URL, product).pipe(map(res => res.data));
  }

  // Modifier un produit (Admin)
  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.API_URL}/${id}`, product).pipe(map(res => res.data));
  }

  // Modifier le stock (Admin)
  updateStock(id: number, operation: 'add' | 'subtract' | 'set', quantity: number): Observable<Product> {
    return this.http.patch<ApiResponse<Product>>(`${this.API_URL}/${id}/stock`, { operation, quantity }).pipe(map(res => res.data));
  }

  // Supprimer un produit (Admin)
  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(map(res => res.data));
  }
}
