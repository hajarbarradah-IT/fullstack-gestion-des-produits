import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductStats, Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { AuthService } from '../../services/auth.service';
import { LoggedUser } from '../../models/logged-user.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-content fade-in-up">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="page-title">Tableau de Bord</h1>
          <p class="page-subtitle">Bienvenue, {{ currentUser?.firstName }} ! Voici un aperçu de votre activité.</p>
        </div>
        <div class="badge-modern badge-primary px-3 py-2" *ngIf="currentUser?.role === 'admin'">
          <i class="bi bi-shield-check me-1"></i>Admin
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4" *ngIf="stats">
        <div class="col-xl-3 col-md-6">
          <div class="stat-card primary">
            <div class="d-flex align-items-center">
              <div class="stat-icon primary me-3"><i class="bi bi-box-seam"></i></div>
              <div>
                <div class="stat-label">Total Produits</div>
                <div class="stat-value">{{ stats.totalProducts }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="stat-card success">
            <div class="d-flex align-items-center">
              <div class="stat-icon success me-3"><i class="bi bi-grid"></i></div>
              <div>
                <div class="stat-label">Catégories</div>
                <div class="stat-value">{{ stats.totalCategories }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="stat-card warning">
            <div class="d-flex align-items-center">
              <div class="stat-icon warning me-3"><i class="bi bi-exclamation-triangle"></i></div>
              <div>
                <div class="stat-label">Stock Faible</div>
                <div class="stat-value">{{ stats.lowStockCount }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="stat-card danger">
            <div class="d-flex align-items-center">
              <div class="stat-icon danger me-3"><i class="bi bi-cash-stack"></i></div>
              <div>
                <div class="stat-label">Valeur Stock</div>
                <div class="stat-value">{{ stats.stockValue | number:'1.0-0' }} DH</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Alertes Stock -->
        <div class="col-lg-6">
          <div class="card-modern h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-exclamation-triangle text-warning me-2"></i>Alertes Stock</h5>
              <span class="badge bg-danger rounded-pill">{{ lowStockProducts.length }}</span>
            </div>
            <div class="card-body p-0" style="max-height: 350px; overflow-y: auto;">
              <div class="text-center py-5 text-muted" *ngIf="lowStockProducts.length === 0">
                <i class="bi bi-check-circle text-success display-4"></i>
                <p class="mt-3 mb-0">Tous les stocks sont OK !</p>
              </div>
              <div class="list-group list-group-flush">
                <div *ngFor="let p of lowStockProducts" class="list-group-item d-flex justify-content-between align-items-center py-3 px-4">
                  <div>
                    <h6 class="mb-0 fw-bold">{{ p.name }}</h6>
                    <small class="text-muted">{{ p.categoryName }}</small>
                  </div>
                  <span class="stock-badge" [class.out-of-stock]="p.stock === 0" [class.low-stock]="p.stock > 0">
                    <i class="bi" [class.bi-x-circle]="p.stock === 0" [class.bi-exclamation-circle]="p.stock > 0"></i>
                    {{ p.stock === 0 ? 'Rupture' : p.stock + ' restants' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Produits par Catégorie -->
        <div class="col-lg-6">
          <div class="card-modern h-100">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Produits par Catégorie</h5>
            </div>
            <div class="card-body">
              <div *ngFor="let cat of stats?.productsByCategory" class="mb-4">
                <div class="d-flex justify-content-between mb-2">
                  <span class="fw-medium">{{ cat.name }}</span>
                  <span class="text-muted">{{ cat.count }} produits</span>
                </div>
                <div class="progress-modern">
                  <div class="progress-bar" [style.background-color]="cat.color" [style.width.%]="getPercentage(cat.count)"></div>
                </div>
              </div>
              <div class="text-center text-muted py-3" *ngIf="!stats?.productsByCategory?.length">
                Aucune catégorie
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Rapides (Admin) -->
      <div class="row g-4 mt-2" *ngIf="currentUser?.role === 'admin'">
        <div class="col-12">
          <div class="card-modern">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-lightning me-2"></i>Actions Rapides</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <a routerLink="/products" class="btn btn-outline-primary w-100 py-3">
                    <i class="bi bi-plus-circle me-2"></i>Ajouter un Produit
                  </a>
                </div>
                <div class="col-md-4">
                  <a routerLink="/categories" class="btn btn-outline-primary w-100 py-3">
                    <i class="bi bi-folder-plus me-2"></i>Nouvelle Catégorie
                  </a>
                </div>
                <div class="col-md-4">
                  <a routerLink="/products" [queryParams]="{lowStock: true}" class="btn btn-outline-warning w-100 py-3">
                    <i class="bi bi-exclamation-triangle me-2"></i>Voir Alertes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: ProductStats | null = null;
  lowStockProducts: Product[] = [];
  categories: Category[] = [];
  currentUser: LoggedUser | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
    this.loadLowStock();
  }

  loadStats(): void {
    this.productService.getStats().subscribe(stats => this.stats = stats);
  }

  loadLowStock(): void {
    this.productService.getLowStock().subscribe(products => this.lowStockProducts = products);
  }

  getPercentage(count: number): number {
    if (!this.stats || this.stats.totalProducts === 0) return 0;
    return (count / this.stats.totalProducts) * 100;
  }
}
