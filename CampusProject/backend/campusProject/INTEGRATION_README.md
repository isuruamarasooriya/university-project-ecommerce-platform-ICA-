# VEXO E-Commerce - Full Stack Integration

## Backend (Spring Boot + MongoDB)

### Project Structure
```
campusProject/
+-- src/main/java/vau/ac/lk/campusProject/
¦   +-- model/
¦   ¦   +-- Product.java
¦   ¦   +-- Order.java
¦   +-- repository/
¦   ¦   +-- ProductRepository.java
¦   ¦   +-- OrderRepository.java
¦   +-- service/
¦   ¦   +-- ProductService.java
¦   ¦   +-- OrderService.java
¦   +-- controller/
¦   ¦   +-- ProductController.java
¦   ¦   +-- OrderController.java
¦   +-- config/
¦   ¦   +-- WebConfig.java
¦   ¦   +-- DataInitializer.java
¦   +-- CampusProjectApplication.java
+-- src/main/resources/
    +-- application.properties
```

### Setup Instructions

#### 1. Start MongoDB
MongoDB needs to be running before starting the Spring Boot application.

**Option A: Using Windows Service (Requires Admin)**
```powershell
Start-Service MongoDB
```

**Option B: Using mongod directly**
```powershell
mongod --dbpath C:\data\db
```

**Option C: If MongoDB service exists but stopped**
Right-click PowerShell/CMD as Administrator and run:
```powershell
net start MongoDB
```

#### 2. Start Spring Boot Backend
Open a terminal in the campusProject directory:
```powershell
cd C:\Users\Spectre\Downloads\campusProject\campusProject
.\mvnw.cmd spring-boot:run
```

The backend will start on **http://localhost:8080**

#### 3. Verify Backend is Running
Open browser or use curl:
```
http://localhost:8080/api/products
```

You should see a JSON array of products.

### API Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/tag/{tag}` - Get products by tag
- `GET /api/products/search?keyword={keyword}` - Search products
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/email/{email}` - Get orders by email
- `GET /api/orders/status/{status}` - Get orders by status
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status?status={status}` - Update order status
- `DELETE /api/orders/{id}` - Delete order

### Database Configuration
```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=vexo_store
```

### Sample Data
The application automatically initializes with 12 sample products on startup.

---

## Frontend (React + Vite)

### Setup Instructions

#### 1. Install Dependencies (if not already done)
```powershell
cd C:\Users\Spectre\Downloads\vexo-—-performance-workout-gear
npm install
```

#### 2. Start Development Server
```powershell
npm run dev
```

The frontend will start on **http://localhost:3000**

### API Integration

The frontend is configured to connect to the backend at `http://localhost:8080/api`

Configuration file: `src/services/api.ts`

### Updated Components

1. **Shop Page** (`src/pages/Shop.tsx`)
   - Fetches products from backend API
   - Displays loading state
   - Handles product filtering and sorting

2. **New Arrivals Section** (`src/sections/NewArrivals.tsx`)
   - Fetches first 8 products from backend
   - Displays on homepage

3. **API Service** (`src/services/api.ts`)
   - Product service methods
   - Order service methods
   - Axios configuration with CORS

---

## Testing the Integration

### 1. Check MongoDB is Running
```powershell
Get-Process mongod
```

### 2. Check Spring Boot is Running
```powershell
Get-Process java
```

### 3. Test Backend API
Open browser: http://localhost:8080/api/products

### 4. Test Frontend
Open browser: http://localhost:3000

The shop page should load products from the backend.

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify data directory exists: `C:\data\db`

### Spring Boot Issues
- Check Java version: `java -version` (requires Java 21)
- Check Maven: `.\mvnw.cmd --version`
- View logs in the Spring Boot terminal window

### CORS Issues
- Backend is configured to allow requests from `http://localhost:3000`
- Check browser console for CORS errors
- Verify WebConfig.java is properly configured

### Frontend API Issues
- Check browser console for network errors
- Verify backend is running on port 8080
- Check `src/services/api.ts` baseURL configuration

---

## Next Steps

1. **Authentication**: Implement user authentication and JWT tokens
2. **Cart Functionality**: Connect cart to backend with session management
3. **Checkout Process**: Implement order creation from cart
4. **Admin Dashboard**: Connect admin panel to backend APIs
5. **Image Upload**: Add image upload functionality for products
6. **Payment Integration**: Add payment gateway (Stripe, PayPal, etc.)

---

## Technologies Used

### Backend
- Spring Boot 4.0.6
- Spring Data MongoDB
- Java 21
- MongoDB

### Frontend
- React 19
- Vite
- TypeScript
- Axios
- Tailwind CSS
- GSAP (animations)

