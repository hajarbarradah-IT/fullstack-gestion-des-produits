# 🛒 Application de Gestion de Produits

## FSAC Master ISI - T. CHANYOUR

Application fullstack de gestion de produits avec **Node.js/Express/SQLite** (Backend) et **Angular/TypeScript** (Frontend).

---

## 📦 Fonctionnalités

### ✅ Authentification
- Inscription avec validation des champs
- Connexion avec JWT
- Profil utilisateur
- Rôles: Admin / User

### ✅ Gestion des Catégories (Admin)
- Liste des catégories
- Créer / Modifier / Supprimer
- Icônes et couleurs personnalisées

### ✅ Gestion des Produits (Admin)
- Liste avec filtres (recherche, catégorie, stock faible)
- Créer / Modifier / Supprimer
- Gestion du stock (ajouter, retirer)

### ✅ Dashboard
- Statistiques (total produits, catégories, valeur stock)
- Alertes stock faible / rupture
- Graphique produits par catégorie

---

## 🚀 Installation et Démarrage

### 1. Backend

```bash
cd backend
npm install
npm start
```

Le serveur démarre sur **http://localhost:3000**

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

L'application est accessible sur **http://localhost:4200**

---

## 👤 Comptes de Test

| Username | Password | Rôle |
|----------|----------|------|
| `admin` | `Password123!` | Administrateur |
| `user` | `Password123!` | Utilisateur |

---

## 📡 API Endpoints

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion |
| GET | `/api/v1/auth/profile` | Profil (JWT) |
| PUT | `/api/v1/auth/profile` | Modifier profil (JWT) |

### Catégories
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/categories` | Liste |
| GET | `/api/v1/categories/:id` | Détail |
| POST | `/api/v1/categories` | Créer (Admin) |
| PUT | `/api/v1/categories/:id` | Modifier (Admin) |
| DELETE | `/api/v1/categories/:id` | Supprimer (Admin) |

### Produits
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/products` | Liste (filtres: categoryId, search, lowStock) |
| GET | `/api/v1/products/stats` | Statistiques |
| GET | `/api/v1/products/low-stock` | Produits en stock faible |
| GET | `/api/v1/products/:id` | Détail |
| POST | `/api/v1/products` | Créer (Admin) |
| PUT | `/api/v1/products/:id` | Modifier (Admin) |
| PATCH | `/api/v1/products/:id/stock` | Modifier stock (Admin) |
| DELETE | `/api/v1/products/:id` | Supprimer (Admin) |

---

## 📁 Structure du Projet

```
isi-fullstack/
├── backend/                    # Node.js + Express + SQLite
│   ├── server.js               # Serveur principal
│   ├── database/
│   │   └── database.js         # Configuration SQLite
│   └── routes/
│       ├── auth.routes.js      # Routes authentification
│       ├── category.routes.js  # Routes catégories
│       └── product.routes.js   # Routes produits
│
└── frontend/                   # Angular + TypeScript
    └── src/app/
        ├── models/             # User, LoggedUser, Category, Product
        ├── services/           # Auth, User, Category, Product
        ├── guards/             # AuthGuard
        ├── interceptors/       # JwtInterceptor
        ├── validators/         # CustomValidators
        └── components/
            ├── home/           # Page d'accueil
            ├── login/          # Connexion
            ├── register/       # Inscription
            ├── profile/        # Profil
            ├── dashboard/      # Tableau de bord
            ├── categories/     # Gestion catégories
            └── products/       # Gestion produits
```

---

## 🔐 Sécurité

- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe
- **CORS** configuré pour Angular
- **Rôles** Admin/User pour les autorisations

---

## 📚 Technologies

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- Angular 17
- TypeScript
- Bootstrap 5
- Bootstrap Icons
- RxJS

---

**Développé pour le cours FSAC Master ISI - T. CHANYOUR**
