import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoggedUser } from '../../models/logged-user.model';

@Component({
  selector: 'app-profile',
  template: `
    <div class="page-content fade-in-up" *ngIf="currentUser">
      <div class="page-header mb-4">
        <h1 class="page-title">Mon Profil</h1>
        <p class="page-subtitle">Gérez vos informations personnelles</p>
      </div>
      
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="card-modern text-center p-4">
            <div class="user-avatar mx-auto mb-3" style="width: 100px; height: 100px; font-size: 2.5rem;">
              {{ getInitials() }}
            </div>
            <h4 class="fw-bold mb-1">{{ currentUser.firstName }} {{ currentUser.lastName }}</h4>
            <p class="text-muted mb-3">{{ '@' + currentUser.username }}</p>
            <span class="badge-modern" [class.badge-primary]="currentUser.role === 'admin'" [class.badge-success]="currentUser.role !== 'admin'">
              <i class="bi me-1" [class.bi-shield-check]="currentUser.role === 'admin'" [class.bi-person]="currentUser.role !== 'admin'"></i>
              {{ currentUser.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
            </span>
          </div>
        </div>
        
        <div class="col-lg-8">
          <div class="card-modern">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Informations du compte</h5>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-sm-4 text-muted fw-medium">Email</div>
                <div class="col-sm-8">{{ currentUser.email }}</div>
              </div>
              <div class="row mb-3" *ngIf="currentUser.permissions && currentUser.permissions.length > 0">
                <div class="col-sm-4 text-muted fw-medium">Permissions</div>
                <div class="col-sm-8">
                  <span *ngFor="let p of currentUser.permissions" class="badge-modern badge-primary me-1">{{ p }}</span>
                </div>
              </div>
              <hr>
              <button class="btn btn-danger" (click)="logout()">
                <i class="bi bi-box-arrow-right me-2"></i>Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: LoggedUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) this.router.navigate(['/login']);
    });
  }

  getInitials(): string {
    if (this.currentUser) {
      const first = this.currentUser.firstName ? this.currentUser.firstName.charAt(0) : '';
      const last = this.currentUser.lastName ? this.currentUser.lastName.charAt(0) : '';
      return (first + last).toUpperCase() || this.currentUser.username.charAt(0).toUpperCase();
    }
    return '?';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
