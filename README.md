# 📚 SchoolBooks - Educational Book Marketplace

> A modern Consumer-to-Consumer (C2C) web platform for buying and selling educational books across all academic levels.

<div align="center">
  <img src="https://github.com/user-attachments/assets/edccade6-44ad-455c-89c5-f67eb64a94f0" alt="schoolBooksLogoSDP" width="300">
</div>


## 🎯 Overview

SchoolBooks addresses the persistent challenge of accessing affordable educational materials by creating a specialized marketplace where students, parents, and educators can buy and sell used textbooks. The platform offers significant cost savings (60-70% compared to retail prices) while promoting sustainable book reuse within academic communities.

### ✨ Key Features

- **📖 Comprehensive Book Catalog** - Educational books for primary, secondary, and higher education
- **🔍 Advanced Search & Filtering** - Search by educational level, subject, condition, and location
- **💰 Three-Tier Subscription Model** - Free, Premium (10 BAM/month), and Premium+ (20 BAM/month)
- **🛒 Complete E-commerce Functionality** - Shopping cart, wishlist, and secure checkout
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🔔 Real-time Notifications** - Order updates and transaction notifications
- **🌍 Geographic Filtering** - Find books in major Bosnian cities (Sarajevo, Mostar, Banja Luka, Tuzla, Zenica)

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Redux Toolkit** for state management
- **React Router** for client-side routing
- **CSS-in-JS** with responsive design

### Backend
- **Laravel** (PHP framework) with RESTful API architecture
- **Laravel Sanctum** for API authentication
- **Eloquent ORM** for database interactions

### Database
- **PostgreSQL** for robust data persistence
- **Laravel Migrations** for version-controlled schema management

### Design & Development Tools
- **Figma** for UI/UX design and prototyping
- **Adobe Illustrator** for brand identity and graphics
- **PHPUnit** for comprehensive testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PHP (v8.1 or higher)
- Composer
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SelmaS777/schoolbooks.git
   cd schoolbooks
   ```

2. **Backend Setup**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure Environment**
   Edit `.env` file with your database credentials:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=schoolbooks
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

6. **Start the Backend Server**
   ```bash
   cd ../backend
   php artisan serve
   ```

The application will be available at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend API).

## 📖 User Roles & Subscription Tiers

### Free Users (0 BAM/month)
- Browse and search all available books
- Purchase books through the platform
- Basic account management

### Premium Users (10 BAM/month)
- All Free features
- Publish up to 20 books for sale
- Enhanced seller tools

### Premium+ Users (20 BAM/month)
- All Premium features
- Publish up to 50 books for sale
- Priority support

## 🎨 Design System

The platform features a cohesive design system with:
- **Primary Color**: Orange (#FF6B35) representing education and energy
- **Typography**: Clean, readable fonts optimized for academic content
- **Responsive Grid**: Mobile-first design approach
- **Component Library**: Reusable UI components for consistency

## 📱 API Documentation

The RESTful API provides endpoints for:

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Users**: `/api/users/*`
- **Categories**: `/api/categories/*`

API documentation is available at `/api/documentation` when running locally (https://schoo-api.onrender.com/api/documentation).

## Project Structure

```
schoolbooks/
├── bshop/                     # Frontend (React)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── Navbar/       # Navigation components
│   │   ├── pages/            # Page components
│   │   │   ├── Product/      # Product-related pages
│   │   │   ├── modal/        # Modal components
│   │   │   └── ...
│   │   ├── services/         # API service functions
│   │   ├── store/            # Redux slices & state
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Helper utilities
│   ├── public/               # Static assets
│   └── package.json
└── schoo-api/                # Backend (Laravel)
    ├── app/
    │   ├── Http/Controllers/ # API controllers
    │   ├── Models/           # Eloquent models
    │   ├── Services/         # Business logic
    │   ├── Middleware/       # Request middleware
    │   └── Providers/        # Service providers
    ├── database/
    │   ├── migrations/       # Database migrations
    │   ├── factories/        # Model factories
    │   └── seeders/          # Database seeders
    ├── tests/
    │   ├── Feature/          # Feature tests
    │   └── Unit/             # Unit tests
    └── routes/
        └── api/              # API routes
```

## 👥 Authors

- **Selma Salman** - *Initial work* - [GitHub Profile](https://github.com/SelmaS777)
- **Dr. Dželila Mehanović** - *Project Supervisor*

## 🙏 Acknowledgments

- International Burch University for academic support
- The open-source community for the amazing tools and libraries
- All contributors who help improve the platform

## 🔮 Future Enhancements

- 📱 Mobile application (React Native)
- 🤖 AI-powered book recommendations
- 💬 Real-time messaging between buyers/sellers
- 🌍 Geographic expansion beyond Bosnia and Herzegovina
- 📸 Camera integration for book condition assessment

---

**Made with ❤️ for the educational community in Bosnia and Herzegovina**
