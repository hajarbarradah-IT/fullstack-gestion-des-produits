import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SchoolLevel } from '../../models/user.model';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container" style="padding: 3rem 1rem;">
      <div class="auth-card fade-in-up" style="max-width: 600px;">
        <div class="auth-header">
          <i class="bi bi-person-plus display-4 mb-3"></i>
          <h2 class="fw-bold mb-2">Créer un compte</h2>
          <p class="mb-0 opacity-75">Rejoignez notre plateforme de gestion</p>
        </div>
        
        <div class="auth-body">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <!-- Informations personnelles -->
            <h6 class="text-uppercase text-muted mb-3 small fw-bold">
              <i class="bi bi-person me-2"></i>Informations Personnelles
            </h6>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Prénom *</label>
                <input type="text" class="form-control" formControlName="firstName"
                       [class.is-invalid]="f['firstName'].touched && f['firstName'].invalid">
                <div class="error-text" *ngIf="f['firstName'].touched && f['firstName'].errors?.['required']">Requis</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nom *</label>
                <input type="text" class="form-control" formControlName="lastName"
                       [class.is-invalid]="f['lastName'].touched && f['lastName'].invalid">
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Date de naissance *</label>
                <input type="date" class="form-control" formControlName="dateOfBirth"
                       [class.is-invalid]="f['dateOfBirth'].touched && f['dateOfBirth'].invalid">
                <div class="error-text" *ngIf="f['dateOfBirth'].errors?.['underAge']">Minimum 15 ans</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Genre *</label>
                <select class="form-select" formControlName="gender">
                  <option value="">Sélectionnez...</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
            </div>

            <!-- Compte -->
            <h6 class="text-uppercase text-muted mb-3 mt-4 small fw-bold">
              <i class="bi bi-key me-2"></i>Identifiants
            </h6>
            
            <div class="mb-3">
              <label class="form-label">Nom d'utilisateur *</label>
              <input type="text" class="form-control" formControlName="username" placeholder="min. 3 caractères"
                     [class.is-invalid]="f['username'].touched && f['username'].invalid">
            </div>
            
            <div class="mb-3">
              <label class="form-label">Email *</label>
              <input type="email" class="form-control" formControlName="email" placeholder="exemple@email.com"
                     [class.is-invalid]="f['email'].touched && f['email'].invalid">
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Mot de passe *</label>
                <input type="password" class="form-control" formControlName="password"
                       [class.is-invalid]="f['password'].touched && f['password'].invalid">
                <small class="text-muted">8 car., 1 Maj, 1 Min, 1 Chiffre, 1 Spécial</small>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Confirmer *</label>
                <input type="password" class="form-control" formControlName="confirmPassword"
                       [class.is-invalid]="f['confirmPassword'].touched && registerForm.errors?.['mustMatch']">
                <div class="error-text" *ngIf="registerForm.errors?.['mustMatch']">Non identiques</div>
              </div>
            </div>

            <!-- Localisation -->
            <h6 class="text-uppercase text-muted mb-3 mt-4 small fw-bold">
              <i class="bi bi-geo-alt me-2"></i>Localisation
            </h6>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Pays *</label>
                <input type="text" class="form-control" formControlName="country"
                       [class.is-invalid]="f['country'].touched && f['country'].invalid">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ville</label>
                <input type="text" class="form-control" formControlName="city">
              </div>
            </div>

            <div class="alert alert-modern alert-danger" *ngIf="errorMessage">
              <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
            </div>
            
            <button type="submit" class="btn btn-primary w-100 py-3 mt-3" [disabled]="isLoading">
              <span *ngIf="!isLoading"><i class="bi bi-check-circle me-2"></i>Créer mon compte</span>
              <span *ngIf="isLoading"><span class="spinner-border spinner-border-sm me-2"></span>Inscription...</span>
            </button>
          </form>
        </div>
        
        <div class="auth-footer">
          <p class="mb-0">Déjà inscrit ? 
            <a routerLink="/login" class="text-decoration-none fw-bold" style="color: var(--primary)">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  schoolLevels = Object.values(SchoolLevel);
  isLoading = false;
  errorMessage: string | null = null;
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, CustomValidators.ageValidator(15)]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      city: [''],
      schoolLevel: [null],
      phoneNumber: ['']
    }, { validators: CustomValidators.match('password', 'confirmPassword') });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    const { confirmPassword, ...userData } = this.registerForm.value;
    
    this.userService.register(userData).subscribe({
      next: () => { this.isLoading = false; alert('Inscription réussie !'); this.router.navigate(['/login']); },
      error: (err) => { this.isLoading = false; this.errorMessage = err.error?.message || 'Erreur'; }
    });
  }

  get f() { return this.registerForm.controls; }
}
