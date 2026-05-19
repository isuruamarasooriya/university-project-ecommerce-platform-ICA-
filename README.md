# 🛒 Multi-Vendor E-Commerce Platform

A full-stack, enterprise-grade e-commerce marketplace platform built with **Spring Boot** (Java/MongoDB backend) and **React** (Vite frontend with Material UI and Framer Motion). The project implements a robust role-based access control system supporting **Customers**, **Sellers**, and **Admins**.

---

## 🎨 Premium User Experience Features

We recently upgraded the core **Customer Profile View** to a modern, premium light-mode dashboard designed for visual excellence:

*   **Mesh Gradient Welcome Banner:** Displays dynamic welcome cards with personalized avatar rings and Gold Membership loyalty badges.
*   **Metric Indicators:** Displays visual count grids for total orders, wishlist counts, active deliveries, and loyalty reward points.
*   **Linear Tracking Bars:** Real-time visual tracking of orders (Pending Approval ➔ In Production ➔ Out for Delivery ➔ Delivered).
*   **Virtual VISA Payment Card:** Interactive card interface featuring masked account numbers, bank details, cardholder name, and IFSC codes.
*   **Security & 2FA Suite:** Fully functional API-connected password updates and database-persisted Two-Factor Authentication switch controls.

---

## 🚀 Key Functional Modules

### 👤 For Customers
*   **JWT Auth System:** Secure login, registration, and session token storage.
*   **Dynamic Marketplace:** Grid views of vendor products, details, and price filtering.
*   **Interactive Shopping Cart & Wishlist:** Real-time adding, removing, and quantity controls.
*   **Order & Progress Panel:** Seamless order checkouts and order status details.

### 💼 For Sellers
*   **Seller Analytics Dashboard:** Financial stats and inventory summary.
*   **Product Catalog Management:** Add, update, delete, and view product lists.
*   **Order Fulfillment:** View received customer orders and update shipping states.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React (Vite), Material UI (MUI), Framer Motion, Axios, React Hot Toast |
| **Backend** | Java 21, Spring Boot, Spring Security (JWT), Spring Data MongoDB |
| **Database** | MongoDB (Local / Atlas Cloud) |
| **Build Tools** | Maven, NPM |

---

## ⚙️ Getting Started

### Prerequisites
*   **JDK 21** installed.
*   **Node.js (v18+)** and **NPM** installed.
*   **MongoDB** running locally on port `27017` (or MongoDB Atlas connection string).

---

### 1. Backend Setup (Spring Boot)

1.  Navigate to the project root directory.
2.  Open `src/main/resources/application.properties` and configure your MongoDB connection:
    ```properties
    spring.data.mongodb.uri=mongodb://localhost:27017/productsell
    ```
3.  Build and run the Spring Boot application using your IDE (Eclipse/IntelliJ) or Maven:
    ```bash
    mvn spring-boot:run
    ```

---

### 2. Frontend Setup (React Vite)

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the local development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5174](http://localhost:5174) in your browser.

---

## 🛡️ Core API Endpoints

### User & Security APIs (`/api/user`)
*   `GET /wishlist` - Fetch all saved wishlist products.
*   `POST /wishlist/{productId}` - Save product to wishlist.
*   `DELETE /wishlist/{productId}` - Remove product from wishlist.
*   `GET /bank-details` - Fetch payment/bank details.
*   `PUT /bank-details` - Update card payment details.
*   `PUT /change-password` - Updates secure password.
*   `GET /2fa` - Checks Two-Factor authentication status.
*   `PUT /2fa?enabled={bool}` - Toggle 2FA in database.

### Orders APIs (`/api/orders`)
*   `POST /checkout` - Place new order from cart.
*   `GET /myorders` - Get customer's orders history.
*   `PUT /{id}/cancel` - Cancel a pending customer order.
*   `GET /seller-orders` - Get orders placed with a seller.
*   `PUT /{id}/status` - Update shipping state of order.