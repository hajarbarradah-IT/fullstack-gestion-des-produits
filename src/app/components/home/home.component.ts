import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 fade-in-up">
            <h1 class="hero-title">
              Gérez vos <span>Produits</span> en toute simplicité
            </h1>
            <p class="hero-subtitle">
              Application complète de gestion des produits, catégories et stocks 
              avec tableau de bord administrateur intuitif.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <a routerLink="/register" class="btn btn-primary btn-lg px-4">
                <i class="bi bi-rocket-takeoff me-2"></i>Commencer
              </a>
              <a routerLink="/login" class="btn btn-outline-light btn-lg px-4">
                <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter
              </a>
            </div>
            
            <div class="row mt-5 pt-4">
              <div class="col-4 text-center">
                <h3 class="text-white mb-1">500+</h3>
                <small class="text-white-50">Produits</small>
              </div>
              <div class="col-4 text-center">
                <h3 class="text-white mb-1">50+</h3>
                <small class="text-white-50">Catégories</small>
              </div>
              <div class="col-4 text-center">
                <h3 class="text-white mb-1">99%</h3>
                <small class="text-white-50">Fiabilité</small>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6 mt-5 mt-lg-0">
            <div class="card-modern p-4 ms-lg-5" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
              <div class="row g-3">
                <div class="col-6">
                  <div class="stat-card primary">
                    <div class="stat-icon primary mb-3"><i class="bi bi-box-seam"></i></div>
                    <div class="stat-value">124</div>
                    <div class="stat-label">Produits</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-card success">
                    <div class="stat-icon success mb-3"><i class="bi bi-grid"></i></div>
                    <div class="stat-value">12</div>
                    <div class="stat-label">Catégories</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-card warning">
                    <div class="stat-icon warning mb-3"><i class="bi bi-exclamation-triangle"></i></div>
                    <div class="stat-value">8</div>
                    <div class="stat-label">Stock faible</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-card danger">
                    <div class="stat-icon danger mb-3"><i class="bi bi-x-circle"></i></div>
                    <div class="stat-value">3</div>
                    <div class="stat-label">Ruptures</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-5 bg-white">
      <div class="container py-4">
        <div class="text-center mb-5">
          <h2 class="fw-bold mb-3">Fonctionnalités Principales</h2>
          <p class="text-muted">Une solution complète pour votre gestion de stock</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="stat-icon primary mx-auto mb-4" style="width: 80px; height: 80px; font-size: 2rem;">
                <i class="bi bi-speedometer2"></i>
              </div>
              <h5 class="fw-bold mb-3">Dashboard Intuitif</h5>
              <p class="text-muted">Visualisez toutes vos statistiques en un coup d'œil avec notre tableau de bord moderne.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="stat-icon success mx-auto mb-4" style="width: 80px; height: 80px; font-size: 2rem;">
                <i class="bi bi-box-seam"></i>
              </div>
              <h5 class="fw-bold mb-3">Gestion des Produits</h5>
              <p class="text-muted">Ajoutez, modifiez et supprimez vos produits facilement avec une interface intuitive.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="stat-icon warning mx-auto mb-4" style="width: 80px; height: 80px; font-size: 2rem;">
                <i class="bi bi-bell"></i>
              </div>
              <h5 class="fw-bold mb-3">Alertes Stock</h5>
              <p class="text-muted">Recevez des alertes automatiques quand vos produits sont en stock faible.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="bg-dark text-white text-center py-4">
      <p class="mb-0"><i class="bi bi-heart-fill text-danger me-2"></i>FSAC Master ISI - T. CHANYOUR</p>
    </footer>
  `
})
export class HomeComponent {}
