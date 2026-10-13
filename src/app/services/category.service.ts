import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

interface ApiResponse<T> { success: boolean; message: string; data: T; }

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API_URL = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les catégories
  getAll(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.API_URL).pipe(map(res => res.data));
  }

  // Récupérer une catégorie par ID
  getById(id: number): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.API_URL}/${id}`).pipe(map(res => res.data));
  }

  // Créer une catégorie (Admin)
  create(category: Category): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.API_URL, category).pipe(map(res => res.data));
  }

  // Modifier une catégorie (Admin)
  update(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.API_URL}/${id}`, category).pipe(map(res => res.data));
  }

  // Supprimer une catégorie (Admin)
  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(map(res => res.data));
  }
}
