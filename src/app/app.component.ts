import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { LoggedUser } from './models/logged-user.model';

@Component({
  selector: 'app-root',
  template: `
    <!-- Layout avec Sidebar (pages connectées) -->
    <div class="app-layout" *ngIf="showSidebar && currentUser">
      
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a class="sidebar-brand" routerLink="/dashboard">
            <i class="bi bi-box-seam"></i>
            <span>GestionPro</span>
          </a>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">Menu Principal</div>
          
          <a routerLink="/dashboard" routerLinkActive="active">
            <i class="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </a>
          
          <a routerLink="/products" routerLinkActive="active">
            <i class="bi bi-box-seam"></i>
            <span>Produits</span>
          </a>
          
          <a routerLink="/categories" routerLinkActive="active">
            <i class="bi bi-grid"></i>
            <span>Catégories</span>
          </a>
          
          <div class="nav-section mt-4">Compte</div>
          
          <a routerLink="/profile" routerLinkActive="active">
            <i class="bi bi-person"></i>
            <span>Mon Profil</span>
          </a>
          
          <a (click)="logout()" style="cursor: pointer;">
            <i class="bi bi-box-arrow-right"></i>
            <span>Déconnexion</span>
          </a>
        </nav>
      </aside>
      
      <!-- Main Content -->
      <div class="main-content">
        <header class="main-header">
          <div>
            <h5 class="mb-0 fw-bold">{{ getPageTitle() }}</h5>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="badge-modern badge-primary" *ngIf="currentUser.role === 'admin'">Admin</span>
            <div class="user-avatar">{{ getInitials() }}</div>
            <div>
              <div class="fw-medium">{{ currentUser.firstName }} {{ currentUser.lastName }}</div>
              <small class="text-muted">{{ currentUser.email }}</small>
            </div>
          </div>
        </header>
        
        <router-outlet></router-outlet>
      </div>
    </div>
    
    <!-- Layout sans Sidebar (pages publiques) -->
    <router-outlet *ngIf="!showSidebar || !currentUser"></router-outlet>
  `,
  styles: [`
    .badge-modern { padding: 0.375rem 0.75rem; border-radius: 6px; font-weight: 500; font-size: 0.75rem; }
    .badge-primary { background: rgba(79, 70, 229, 0.1); color: #4f46e5; }
  `]
})
export class AppComponent implements OnInit {
  currentUser: LoggedUser | null = null;
  showSidebar = false;
  currentRoute = '';

  private publicRoutes = ['/home', '/login', '/register', '/'];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.showSidebar = !this.publicRoutes.some(route => this.currentRoute === route || this.currentRoute.startsWith(route + '?'));
    });
  }

  getInitials(): string {
    if (this.currentUser) {
      const first = this.currentUser.firstName ? this.currentUser.firstName.charAt(0) : '';
      const last = this.currentUser.lastName ? this.currentUser.lastName.charAt(0) : '';
      return (first + last).toUpperCase() || '?';
    }
    return '?';
  }

  getPageTitle(): string {
    if (this.currentRoute.includes('dashboard')) return 'Tableau de Bord';
    if (this.currentRoute.includes('products')) return 'Gestion des Produits';
    if (this.currentRoute.includes('categories')) return 'Gestion des Catégories';
    if (this.currentRoute.includes('profile')) return 'Mon Profil';
    return 'GestionPro';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
