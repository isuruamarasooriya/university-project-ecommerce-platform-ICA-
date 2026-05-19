# 💎 Customer Profile Redesign & Security Integration

This branch (`dinuka`) contains the complete redesign of the customer profile dashboard into a premium, light-mode interface, along with the corresponding backend security and order features.

---

## 🎨 Frontend Updates (React)

*   **Responsive Dashboard Layout (`Profile.jsx`)**:
    *   Replaced inline styling and broken Tailwind wrappers with Material UI's `Box` model and dynamic responsive grids (`xs`, `sm`, `md`, `lg`, `xl`).
    *   Transitioned the theme to a premium light mode (Slate-50 background, white cards, soft borders, and slate text colors).
*   **Mesh Gradient Hero Section**:
    *   Personalized welcome message and user initials avatar with glowing borders.
    *   Gold Membership badge indicating loyalty tier.
    *   Logout and Quick Update buttons with smooth animations.
*   **Metric Grid Cards**:
    *   Displays real-time customer statistics: *Total Orders*, *Saved Wishlist Items*, *Active Deliveries*, and *Reward Points*.
*   **Interactive Visual Payment Card**:
    *   Visa-inspired premium credit card interface displaying bank name, masked account number, holder name, and IFSC code.
*   **Navigation Tabs**:
    *   **My Profile**: Dashboard overview with recent activities and payment card.
    *   **My Orders**: Collapsible listing of ordered items and active shipping progress tracking.
    *   **Wishlist**: Grid view of saved items with quick "Add to Cart" and delete actions.
    *   **Payment Settings**: Form to update banking details.
    *   **Security & 2FA**: Working forms to update passwords and toggle database-persisted Two-Factor Authentication.
    *   **Activity Timeline**: Log listing of account events.

---

## ☕ Backend Updates (Spring Boot)

*   **Password Management**:
    *   Implemented `PUT /api/user/change-password` endpoint.
    *   Verifies current password matches using BCrypt `PasswordEncoder` before updating database hash.
*   **Two-Factor Authentication (2FA)**:
    *   Implemented `GET /api/user/2fa` and `PUT /api/user/2fa` endpoints to persist 2FA switch states.
*   **Order Cancellation**:
    *   Implemented `PUT /api/orders/{id}/cancel` endpoint to cancel pending orders.
*   **Product Reviews**:
    *   Created `ReviewController.java`, `Review.java`, and `ReviewRepository.java` to support saving and retrieving product reviews.

---

## 📁 Key File Changes

*   `frontend/src/pages/Profile.jsx` - Refactored responsive layout, styles, and added security/2FA API calls.
*   `src/main/java/com/ecommerce/controller/UserController.java` - Added endpoints for changing passwords and toggling 2FA.
*   `src/main/java/com/ecommerce/service/UserService.java` - Implemented password checks and 2FA database save states.
*   `src/main/java/com/ecommerce/model/User.java` - Added `twoFactorEnabled` boolean property.
*   `src/main/java/com/ecommerce/dto/ChangePasswordRequest.java` - New DTO for password payloads.
*   `src/main/java/com/ecommerce/controller/ReviewController.java` - New controller for product reviews.
*   `src/main/java/com/ecommerce/model/Review.java` - New MongoDB model for reviews.
