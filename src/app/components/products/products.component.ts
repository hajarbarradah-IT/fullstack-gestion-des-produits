import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  template: `
    <div class="page-content fade-in-up">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="page-title">Produits</h1>
          <p class="page-subtitle">Gérez votre inventaire de produits</p>
        </div>
        <button class="btn btn-primary" *ngIf="isAdmin" (click)="openModal()">
          <i class="bi bi-plus-lg me-2"></i>Nouveau Produit
        </button>
      </div>

      <!-- Filtres -->
      <div class="card-modern mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-center">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Rechercher un produit..." [(ngModel)]="searchTerm" (input)="applyFilters()">
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="selectedCategory" (change)="applyFilters()">
                <option [ngValue]="null">Toutes les catégories</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [(ngModel)]="showLowStock" (change)="applyFilters()" id="lowStockSwitch">
                <label class="form-check-label" for="lowStockSwitch">Stock faible uniquement</label>
              </div>
            </div>
            <div class="col-md-2 text-end">
              <span class="badge-modern badge-primary">{{ products.length }} produits</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Table des produits -->
      <div class="card-modern">
        <div class="table-responsive">
          <table class="table-modern">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th class="text-end">Prix</th>
                <th class="text-center">Stock</th>
                <th class="text-center" *ngIf="isAdmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="stat-icon primary me-3" style="width: 45px; height: 45px; font-size: 1rem;">
                      <i class="bi bi-box"></i>
                    </div>
                    <div>
                      <h6 class="mb-0 fw-bold">{{ p.name }}</h6>
                      <small class="text-muted">{{ p.description | slice:0:40 }}{{ p.description && p.description.length > 40 ? '...' : '' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge-modern" [style.background-color]="p.categoryColor + '20'" [style.color]="p.categoryColor">
                    {{ p.categoryName || 'Non classé' }}
                  </span>
                </td>
                <td class="text-end">
                  <span class="fw-bold">{{ p.price | number:'1.2-2' }} DH</span>
                </td>
                <td class="text-center">
                  <span class="stock-badge" [class.in-stock]="p.stock > p.minStock" [class.low-stock]="p.stock > 0 && p.stock <= p.minStock" [class.out-of-stock]="p.stock === 0">
                    <i class="bi me-1" [class.bi-check-circle]="p.stock > p.minStock" [class.bi-exclamation-circle]="p.stock > 0 && p.stock <= p.minStock" [class.bi-x-circle]="p.stock === 0"></i>
                    {{ p.stock }}
                  </span>
                </td>
                <td class="text-center" *ngIf="isAdmin">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" title="Ajouter stock" (click)="updateStock(p, 'add')">
                      <i class="bi bi-plus"></i>
                    </button>
                    <button class="btn btn-outline-warning" title="Retirer stock" (click)="updateStock(p, 'subtract')">
                      <i class="bi bi-dash"></i>
                    </button>
                    <button class="btn btn-outline-primary" title="Modifier" (click)="editProduct(p)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Supprimer" (click)="deleteProduct(p)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="products.length === 0">
                <td [attr.colspan]="isAdmin ? 5 : 4" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox display-4"></i>
                  <p class="mt-3 mb-0">Aucun produit trouvé</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Produit -->
      <div class="modal fade" id="productModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">{{ editingProduct ? 'Modifier' : 'Nouveau' }} Produit</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-8 mb-3">
                    <label class="form-label">Nom du produit *</label>
                    <input type="text" class="form-control" formControlName="name" placeholder="Nom du produit">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Catégorie</label>
                    <select class="form-select" formControlName="categoryId">
                      <option [ngValue]="null">Aucune</option>
                      <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" rows="2" formControlName="description" placeholder="Description du produit"></textarea>
                </div>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Prix (DH) *</label>
                    <input type="number" class="form-control" formControlName="price" min="0" step="0.01" placeholder="0.00">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Stock actuel</label>
                    <input type="number" class="form-control" formControlName="stock" min="0" placeholder="0">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Stock minimum</label>
                    <input type="number" class="form-control" formControlName="minStock" min="0" placeholder="5">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid">
                  <i class="bi bi-check-lg me-2"></i>Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm!: FormGroup;
  editingProduct: Product | null = null;
  isAdmin = false;
  
  searchTerm = '';
  selectedCategory: number | null = null;
  showLowStock = false;
  
  private modal: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadCategories();
    
    this.route.queryParams.subscribe(params => {
      this.showLowStock = params['lowStock'] === 'true';
      this.loadProducts();
    });
    
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, Validators.min(0)],
      minStock: [5, Validators.min(0)],
      categoryId: [null]
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  loadProducts(): void {
    this.productService.getAll({
      categoryId: this.selectedCategory || undefined,
      search: this.searchTerm || undefined,
      lowStock: this.showLowStock
    }).subscribe(products => this.products = products);
  }

  applyFilters(): void { this.loadProducts(); }

  openModal(product?: Product): void {
    this.editingProduct = product || null;
    if (product) {
      this.productForm.patchValue(product);
    } else {
      this.productForm.reset({ price: 0, stock: 0, minStock: 5 });
    }
    // @ts-ignore
    this.modal = new bootstrap.Modal(document.getElementById('productModal'));
    this.modal.show();
  }

  editProduct(p: Product): void { this.openModal(p); }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    const data = this.productForm.value;
    
    if (this.editingProduct) {
      this.productService.update(this.editingProduct.id!, data).subscribe(() => { this.loadProducts(); this.modal.hide(); });
    } else {
      this.productService.create(data).subscribe(() => { this.loadProducts(); this.modal.hide(); });
    }
  }

  updateStock(p: Product, operation: 'add' | 'subtract'): void {
    const msg = operation === 'add' ? 'Quantité à ajouter :' : 'Quantité à retirer :';
    const quantity = prompt(msg, '1');
    if (quantity && !isNaN(+quantity) && +quantity > 0) {
      this.productService.updateStock(p.id!, operation, +quantity).subscribe(() => this.loadProducts());
    }
  }

  deleteProduct(p: Product): void {
    if (confirm('Supprimer le produit "' + p.name + '" ?')) {
      this.productService.delete(p.id!).subscribe(() => this.loadProducts());
    }
  }
}
