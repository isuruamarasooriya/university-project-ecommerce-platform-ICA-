# 🛒 MultiVendor Marketplace

A modern full-stack **Multi-Vendor E-Commerce Marketplace** built using **Spring Boot**, **MongoDB**, and **React Vite**. The platform delivers a premium shopping experience with advanced customer features, seller management tools, secure authentication, interactive dashboards, and responsive modern UI design.

The application supports three major roles:

* 👤 Customers
* 💼 Sellers
* 🛡️ Administrators

---

# ✨ Platform Highlights

## 🎨 Premium Customer Experience

The marketplace has been redesigned with a modern luxury-inspired UI focused on usability, performance, and engagement.

### ✅ Advanced Customer Profile Dashboard

The customer profile page includes:

* 🌈 Dynamic mesh-gradient welcome banner
* 👤 Animated circular profile avatars
* ⭐ Gold membership loyalty badges
* 📊 Account statistics overview
* 🚚 Real-time order tracking progress bars
* 💳 Interactive virtual VISA payment card
* 🔐 Secure password management system
* 🛡️ Two-Factor Authentication (2FA) controls
* ❤️ Wishlist preview section
* 📦 Active deliveries overview

---

## 🛍️ Marketplace Features

### 👤 Customer Features

* Secure JWT Authentication
* User Registration & Login
* Product Browsing & Filtering
* Dynamic Product Detail Pages
* Shopping Cart Management
* Interactive Wishlist System
* Real-Time Quantity Updates
* Multi-Payment Checkout System
* Order Tracking & History
* Order Cancellation System
* Saved Payment Methods
* Responsive Mobile Experience

---

### 💼 Seller Features

* Seller Analytics Dashboard
* Product Management System
* Add / Update / Delete Products
* Inventory Monitoring
* Order Fulfillment Management
* Shipping Status Updates
* Revenue Statistics
* Seller Catalog Management

---

### 🛡️ Admin Features

* User Management
* Seller Management
* Product Moderation
* Order Monitoring
* Platform Statistics
* Marketplace Administration Controls

---

# 🎨 UI & Design Features

The frontend is designed with a premium modern UI approach inspired by enterprise marketplaces.

## Included UI Enhancements

* ✨ Glassmorphism Cards
* 🌈 Gradient Mesh Backgrounds
* 🎬 Framer Motion Animations
* 📱 Fully Responsive Design
* 💡 Interactive Hover Effects
* 🔔 Toast Notification System
* 🧩 Modern Dashboard Layouts
* ⚡ Smooth Page Transitions

---

# 🛠️ Technology Stack

| Layer            | Technologies                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| Frontend         | React (Vite), Material UI (MUI), Framer Motion, Axios, React Hot Toast |
| Backend          | Java 21, Spring Boot, Spring Security, JWT Authentication              |
| Database         | MongoDB (Local / Atlas Cloud)                                          |
| State Management | Zustand                                                                |
| Build Tools      | Maven, NPM                                                             |
| Version Control  | Git & GitHub                                                           |

---

# 📁 Project Structure

```bash
MultiVendorMarketplace/
│
├── backend/
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 📌 Prerequisites

Make sure the following are installed:

* Java JDK 21+
* Node.js v18+
* MongoDB
* Maven
* Git

---

# 🚀 Backend Setup (Spring Boot)

## 1️⃣ Navigate to Backend

```bash
cd backend
```

## 2️⃣ Configure MongoDB Connection

Open:

```properties
src/main/resources/application.properties
```

Update:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/productsell
```

---

## 3️⃣ Run Backend Server

Using Maven:

```bash
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# 🚀 Frontend Setup (React Vite)

## 1️⃣ Navigate to Frontend

```bash
cd frontend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Start Development Server

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5174
```

---

# 🔐 Authentication & Security

The platform uses:

* JWT-based authentication
* Secure password encryption
* Role-based access control
* Two-Factor Authentication (2FA)
* Protected API routes
* Secure session handling

---

# 🛡️ Core API Endpoints

## 👤 User APIs (`/api/user`)

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/wishlist`             | Get all wishlist items       |
| POST   | `/wishlist/{productId}` | Add product to wishlist      |
| DELETE | `/wishlist/{productId}` | Remove product from wishlist |
| GET    | `/bank-details`         | Fetch payment details        |
| PUT    | `/bank-details`         | Update payment details       |
| PUT    | `/change-password`      | Update account password      |
| GET    | `/2fa`                  | Check 2FA status             |
| PUT    | `/2fa?enabled=true`     | Enable/Disable 2FA           |

---

## 📦 Orders APIs (`/api/orders`)

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | `/checkout`      | Place customer order   |
| GET    | `/myorders`      | Fetch customer orders  |
| PUT    | `/{id}/cancel`   | Cancel pending order   |
| GET    | `/seller-orders` | Fetch seller orders    |
| PUT    | `/{id}/status`   | Update shipping status |

---

# 📸 Main Application Modules

## 🏠 Home Marketplace

* Featured products
* Dynamic categories
* Trending products
* Responsive product grids

## 🛒 Shopping Cart

* Quantity controls
* Payment integration
* Coupon-ready structure
* Order summary sidebar

## ❤️ Wishlist System

* Animated wishlist cards
* Dynamic save/remove actions
* Real-time updates

## 👤 Profile Dashboard

* Loyalty badge system
* Order progress tracking
* Saved payment cards
* Security settings

## 💼 Seller Dashboard

* Sales overview
* Revenue analytics
* Inventory management
* Order fulfillment panel

---

# 🌟 Planned Future Enhancements

Upcoming premium features:

* 🔔 Real-time notifications
* 💬 Buyer ↔ Seller live chat
* ⭐ Product reviews & ratings
* 🎟️ Coupon & discount engine
* 📈 Advanced analytics dashboard
* 🧠 AI product recommendations
* 🌍 Multi-language support
* 🌙 Dark / Light mode switching
* 📱 Mobile application version

---

# 📷 Recommended Screenshots

Add screenshots for:

* Homepage
* Product Page
* Shopping Cart
* Customer Profile Dashboard
* Seller Dashboard
* Checkout Page

Example:

```md
![Homepage](screenshots/homepage.png)
```

---

# 🤝 Contributing

Contributions, improvements, and feature suggestions are welcome.

## Steps

```bash
git clone <repository-url>
cd MultiVendorMarketplace
```

Create a new branch:

```bash
git checkout -b feature/new-feature
```

Commit changes:

```bash
git commit -m "Added new feature"
```

Push branch:

```bash
git push origin feature/new-feature
```

---

# 📄 License

This project is developed for educational and portfolio purposes.

---

# 👨‍💻 Developed By

Dinuka Avindra Silva

Full-Stack Developer

Technologies:

* Java Spring Boot
* React Vite
* MongoDB
* Material UI
* Framer Motion

---

# ⭐ Final Vision

The goal of this project is to build a modern enterprise-grade multi-vendor marketplace that combines:

* Amazon-like usability
* Premium modern UI/UX
* Secure enterprise architecture
* Real-time marketplace interactions
* Scalable full-stack engineering

The platform is designed to evolve into a production-ready marketplace ecosystem with premium customer and seller experiences.
