import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <div class="auth-card fade-in-up">
        <div class="auth-header">
          <i class="bi bi-box-seam display-4 mb-3"></i>
          <h2 class="fw-bold mb-2">Connexion</h2>
          <p class="mb-0 opacity-75">Accédez à votre espace de gestion</p>
        </div>
        
        <div class="auth-body">
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
            <div class="mb-4">
              <label class="form-label">Nom d'utilisateur</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input type="text" class="form-control" formControlName="username" 
                       placeholder="Entrez votre username"
                       [class.is-invalid]="f['username'].touched && f['username'].invalid">
              </div>
              <div class="error-text" *ngIf="f['username'].touched && f['username'].errors?.['required']">
                Le nom d'utilisateur est requis
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label">Mot de passe</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input type="password" class="form-control" formControlName="password"
                       placeholder="Entrez votre mot de passe"
                       [class.is-invalid]="f['password'].touched && f['password'].invalid">
              </div>
              <div class="error-text" *ngIf="f['password'].touched && f['password'].errors?.['required']">
                Le mot de passe est requis
              </div>
            </div>
            
            <div class="alert alert-modern alert-danger" *ngIf="errorMessage">
              <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
            </div>
            
            <button type="submit" class="btn btn-primary w-100 py-3" [disabled]="isLoading">
              <span *ngIf="!isLoading">
                <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter
              </span>
              <span *ngIf="isLoading">
                <span class="spinner-border spinner-border-sm me-2"></span>Connexion...
              </span>
            </button>
          </form>
        </div>
        
        <div class="auth-footer">
          <p class="mb-0">Pas encore de compte ? 
            <a routerLink="/register" class="text-decoration-none fw-bold" style="color: var(--primary)">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    if (this.authService.isLoggedIn()) this.router.navigate([this.returnUrl]);
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => { this.isLoading = false; this.router.navigate([this.returnUrl]); },
      error: (err) => { this.isLoading = false; this.errorMessage = err.error?.message || 'Identifiants invalides'; }
    });
  }

  get f() { return this.loginForm.controls; }
}
