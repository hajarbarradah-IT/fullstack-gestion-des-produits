import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoggedUser } from '../models/logged-user.model';
import { environment } from '../../environments/environment';

interface ApiResponse<T> { success: boolean; message: string; data: T; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEY = 'currentUser';
  
  private currentUserSubject = new BehaviorSubject<LoggedUser | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredUser(): LoggedUser | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  login(credentials: { username: string; password: string }): Observable<LoggedUser> {
    return this.http.post<ApiResponse<LoggedUser>>(`${this.API_URL}/login`, credentials).pipe(
      map(res => res.data),
      tap(user => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean { return !!this.currentUserSubject.value; }
  getToken(): string | null { return this.currentUserSubject.value?.token || null; }
  getCurrentUser(): LoggedUser | null { return this.currentUserSubject.value; }
  isAdmin(): boolean { return this.currentUserSubject.value?.role === 'admin'; }
}
