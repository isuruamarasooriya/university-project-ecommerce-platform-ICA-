# Skill Market - E-Commerce Platform

A full-stack e-commerce web application built with **Spring Boot** (Backend) and **React** (Frontend). This platform supports multiple user roles, allowing sellers to manage their inventory and customers to browse and purchase products seamlessly.

## 🚀 Features

### For Customers
* **User Authentication:** Secure registration and login using JWT.
* **Product Discovery:** Browse products uploaded by various sellers.
* **Shopping Cart & Wishlist:** Add items to a cart or save them for later.
* **Secure Checkout:** Integrated payment processing.
* **Order Tracking:** View past orders and delivery status.

### For Sellers
* **Seller Dashboard:** Dedicated interface for sellers after authentication.
* **Product Management:** Add, update, view, and delete product listings.
* **Order Management:** View and update the status of customer orders.
* **Secure Access:** Role-based access control prevents unauthorized access to seller tools.

## 🛠️ Technologies Used

**Frontend:**
* React.js
* Tailwind CSS
* Axios (for API requests)
* HTML5 & Modern UI components

**Backend:**
* Java 21
* Spring Boot 4.0.3
* Spring Security (JWT Authentication)
* Spring Data JPA / Hibernate

**Infrastructure & Tools:**
* Database: MySQL / PostgreSQL (Update based on your DB)
* Build Tool: Maven
* Version Control: Git & GitHub

## ⚙️ Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* Java Development Kit (JDK) 21
* Node.js and npm (Node Package Manager)
* Maven
* A running instance of your chosen Database (e.g., MySQL)

### Backend Setup (Spring Boot)
1. Navigate to the backend directory.
2. Open `src/main/resources/application.properties` and configure your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/skillmarket
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password