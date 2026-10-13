import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categories',
  template: `
    <div class="page-content fade-in-up">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="page-title">Catégories</h1>
          <p class="page-subtitle">Gérez vos catégories de produits</p>
        </div>
        <button class="btn btn-primary" *ngIf="isAdmin" (click)="openModal()">
          <i class="bi bi-plus-lg me-2"></i>Nouvelle Catégorie
        </button>
      </div>

      <!-- Liste des catégories -->
      <div class="row g-4">
        <div class="col-md-6 col-lg-4 col-xl-3" *ngFor="let cat of categories">
          <div class="card-modern h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="stat-icon me-3" [style.background-color]="cat.color + '20'" [style.color]="cat.color">
                  <i class="bi {{ cat.icon || 'bi-folder' }}"></i>
                </div>
                <div class="flex-grow-1">
                  <h5 class="mb-0 fw-bold">{{ cat.name }}</h5>
                  <small class="text-muted">{{ cat.productCount || 0 }} produits</small>
                </div>
              </div>
              <p class="text-muted small mb-3">{{ cat.description || 'Aucune description' }}</p>
              <div class="d-flex gap-2" *ngIf="isAdmin">
                <button class="btn btn-sm btn-outline-primary flex-grow-1" (click)="editCategory(cat)">
                  <i class="bi bi-pencil me-1"></i>Modifier
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteCategory(cat)" [disabled]="cat.productCount && cat.productCount > 0">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-12" *ngIf="categories.length === 0">
          <div class="card-modern">
            <div class="card-body text-center py-5 text-muted">
              <i class="bi bi-folder display-4"></i>
              <p class="mt-3 mb-0">Aucune catégorie trouvée</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="categoryModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">{{ editingCategory ? 'Modifier' : 'Nouvelle' }} Catégorie</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nom *</label>
                  <input type="text" class="form-control" formControlName="name" placeholder="Nom de la catégorie">
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" rows="2" formControlName="description" placeholder="Description optionnelle"></textarea>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Icône Bootstrap</label>
                    <input type="text" class="form-control" formControlName="icon" placeholder="bi-folder">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Couleur</label>
                    <input type="color" class="form-control form-control-color w-100" formControlName="color" style="height: 45px;">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="submit" class="btn btn-primary" [disabled]="categoryForm.invalid">
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
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm!: FormGroup;
  editingCategory: Category | null = null;
  isAdmin = false;
  private modal: any;

  constructor(private categoryService: CategoryService, private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadCategories();
    this.initForm();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      icon: ['bi-folder'],
      color: ['#4f46e5']
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  openModal(category?: Category): void {
    this.editingCategory = category || null;
    if (category) {
      this.categoryForm.patchValue(category);
    } else {
      this.categoryForm.reset({ icon: 'bi-folder', color: '#4f46e5' });
    }
    // @ts-ignore
    this.modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    this.modal.show();
  }

  editCategory(cat: Category): void { this.openModal(cat); }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;
    const data = this.categoryForm.value;
    
    if (this.editingCategory) {
      this.categoryService.update(this.editingCategory.id!, data).subscribe(() => { this.loadCategories(); this.modal.hide(); });
    } else {
      this.categoryService.create(data).subscribe(() => { this.loadCategories(); this.modal.hide(); });
    }
  }

  deleteCategory(cat: Category): void {
    if (confirm('Supprimer la catégorie "' + cat.name + '" ?')) {
      this.categoryService.delete(cat.id!).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error?.message || 'Erreur')
      });
    }
  }
}
