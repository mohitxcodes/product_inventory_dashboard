# 📦 Product Inventory Management System

A full-stack, enterprise-grade Product Inventory Management System built following the internship project report from **Octaphores Private Limited** and **Chandigarh University**.

The project features a **Spring Boot 3.x REST API** backend paired with a **React 18** dashboard designed with a modern SaaS aesthetic (Linear / Vercel dark theme).

---

## 🚀 Live System URLs

| Service | URL | Notes |
|---|---|---|
| **Frontend Dashboard** | [http://localhost:3000](http://localhost:3000) | Dark-themed, interactive, real-time UI |
| **Backend REST APIs** | [http://localhost:8080/api](http://localhost:8080/api) | Spring Boot 3.2.5 REST services |
| **Swagger UI / OpenAPI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive API documentation |
| **H2 In-Memory DB Console** | [http://localhost:8080/h2-console](http://localhost:8080/h2-console) | JDBC URL: `jdbc:h2:mem:inventorydb`, User: `sa` |

---

## 🛠️ Technology Stack

### **Backend (Spring Boot 3.x)**
- **Java 17** & **Spring Boot 3.2.5**
- **Layered Architecture**: Controller Layer → Service Layer → Repository Layer → Database Layer
- **Spring Data JPA & Hibernate**: ORM with `@Entity`, custom JPQL queries, lazy loading
- **Bean Validation (JSR-303)**: `@Valid`, `@NotBlank`, `@NotNull`, `@Positive`, `@Min`
- **Global Exception Handling**: `@RestControllerAdvice` returning structured JSON error schemas
- **In-Memory H2 Database**: Preloaded with seed categories, products, and transaction records (`data.sql`)
- **OpenAPI 3 / Swagger**: Auto-generated interactive API docs
- **CORS Configured**: Fully mapped for frontend client integration

### **Frontend (React 18 + Vite)**
- **React 18** (Vite build system for sub-second HMR)
- **Design System**: Custom CSS variables with dark theme palette, glassmorphism card borders, and smooth transitions
- **Recharts**: Products-per-category bar chart & category distribution donut chart
- **Lucide React**: Crisp vector iconography
- **React Hot Toast**: Real-time notifications for CRUD and transaction operations
- **No Auth / No Login**: Instant access to all dashboard operations

---

## 📋 REST API Endpoints Summary

### 1. Products (`/api/products`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products?page=0&size=10&sortBy=id&sortDir=asc` | Paginated and sortable product list |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create a new product (validates SKU uniqueness) |
| `PUT` | `/api/products/{id}` | Update product details |
| `DELETE` | `/api/products/{id}` | Delete a product |
| `GET` | `/api/products/search?keyword=...` | Search products by name or description |
| `GET` | `/api/products/category/{categoryId}` | Filter products by category |
| `GET` | `/api/products/low-stock?threshold=10` | Retrieve products below safety threshold |

### 2. Categories (`/api/categories`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Get all categories with product counts |
| `GET` | `/api/categories/{id}` | Get category by ID |
| `POST` | `/api/categories` | Create new category (validates unique name) |
| `PUT` | `/api/categories/{id}` | Update existing category |
| `DELETE` | `/api/categories/{id}` | Delete category (checks referential integrity) |

### 3. Stock Transactions (`/api/stock-transactions`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stock-transactions` | List all historical stock movements |
| `POST` | `/api/stock-transactions/stock-in` | Receive stock (increments product quantity atomically) |
| `POST` | `/api/stock-transactions/stock-out` | Dispatch stock (validates availability, decrements quantity) |
| `GET` | `/api/stock-transactions/product/{productId}` | Get transaction history for specific product |

### 4. Dashboard Metrics (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated metrics: total products, valuation, movements, low stock |

---

## 🖥️ Application Features & Pages

1. **Dashboard (`/`)**
   - KPI counters with smooth cubic easing animation (Valuation, Total Products, Inbound/Outbound counts)
   - Recharts bar & donut charts illustrating category composition
   - Audit trail of the 5 most recent stock transactions
   - Quick attention widget for critically low-stock items

2. **Products Management (`/products`)**
   - Real-time search across product name and SKU
   - Category filter dropdown
   - Sortable columns (ID, Name, SKU, Price, Quantity)
   - Dynamic stock badges (`In Stock`, `Low Stock`, `Out of Stock`)
   - Direct 1-click Quick Stock-In and Stock-Out from table rows
   - Modal dialogs for adding, editing, and deleting items

3. **Categories (`/categories`)**
   - Card grid layout highlighting description and linked product counts
   - Add/edit category modals with real-time validation
   - Referential integrity safeguards against accidental cascading deletes

4. **Stock Transactions Ledger (`/transactions`)**
   - Filter by movement type (`ALL`, `Inbound`, `Outbound`)
   - Product filter dropdown and text search
   - Fast action buttons for receiving or dispatching inventory

5. **Low Stock Alert Center (`/low-stock`)**
   - Interactive threshold slider (1 to 50 units)
   - Visual deficit progress bar
   - 1-click Restock modal to replenish depleted items

---

## 🏃 Quick Start Guide

### Starting the Backend
```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@17   # or your Java 17 path
java -jar target/product-inventory-management-1.0.0.jar
```
*Backend runs on port `8080`.*

### Starting the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on port `3000` and automatically proxies `/api` requests to backend.*
