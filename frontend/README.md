# Marketplace Frontend

A modern React frontend application for the Marketplace API, built with Vite, React Router, and Context API for state management.

## Features

- 🔐 **Authentication** - Login/logout with JWT token management
- 🛍️ **Product Browsing** - View all products with detailed information
- 📦 **Product Details** - Detailed product view with add to cart functionality
- 🛒 **Shopping Cart** - Full cart management (add, update, remove items)
- 🎨 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast** - Built with Vite for lightning-fast development and builds
- 🔄 **State Management** - Context API for auth and cart state

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management
- **CSS3** - Modern styling

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Navigation bar with auth state
│   ├── ProductCard.jsx      # Product card component
│   └── ProtectedRoute.jsx   # Route protection wrapper
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Products.jsx         # Product listing page
│   ├── ProductDetail.jsx    # Product detail page
│   └── Cart.jsx             # Shopping cart page
├── context/
│   ├── AuthContext.jsx      # Authentication context & provider
│   └── CartContext.jsx      # Cart context & provider
├── services/
│   └── api.js               # API service layer with axios
├── styles/
│   └── index.css            # Global styles
├── App.jsx                  # Main app component with routing
└── main.jsx                 # App entry point
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

### Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Usage

### Login

1. Navigate to `/login` or click "Login" in the navbar
2. Use test credentials:
   - **Email**: `john.doe@example.com`
   - **Password**: `password123`
3. Upon successful login, you'll be redirected to the products page

### Browse Products

1. Navigate to `/products` or click "Products" in navbar
2. View all available products in a grid layout
3. Click on any product card to view details
4. Add products to cart directly from the product cards

### Product Details

1. Click on any product to view its details
2. View full description, price, stock, and seller information
3. Select quantity and add to cart
4. Navigate back to products or to cart

### Shopping Cart

1. Click "Cart" in the navbar to view your cart (requires login)
2. View all items in your cart with images and prices
3. Update quantities using +/- buttons
4. Remove items with the "Remove" button
5. Clear entire cart with "Clear Cart" button
6. View total price in the order summary

## Features Implemented

### ✅ Core Features (Required)

- [x] User authentication with login/logout
- [x] JWT token storage and management
- [x] Protected routes for authenticated users
- [x] Product listing with pagination support
- [x] Product detail view
- [x] Shopping cart with full CRUD operations
- [x] Loading and error states
- [x] Navigation bar with auth state
- [x] Responsive design

### ⭐ Additional Features

- [x] Cart count badge in navbar
- [x] Local storage for cart persistence
- [x] Backend cart synchronization
- [x] User-friendly error messages
- [x] Clean, modern UI design
- [x] Axios interceptors for auth
- [x] Auto-redirect on token expiration

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api`:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

## State Management

### AuthContext

Manages user authentication state:
- `user` - Current user object
- `isAuthenticated` - Boolean auth status
- `login(email, password)` - Login function
- `logout()` - Logout function
- `register(userData)` - Registration function

### CartContext

Manages shopping cart state:
- `cart` - Array of cart items
- `addToCart(product, quantity)` - Add item to cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `removeFromCart(productId)` - Remove item
- `clearCart()` - Clear all items
- `getCartTotal()` - Calculate total price
- `getCartCount()` - Get total item count

## Environment Configuration

The app is configured to connect to:
- **Backend API**: `http://localhost:3000/api`
- **Frontend Dev Server**: `http://localhost:5173`

Vite proxy configuration in `vite.config.js` forwards `/api` requests to the backend.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure

- **Components** - Reusable UI components
- **Pages** - Route-level components
- **Context** - Global state management
- **Services** - API communication layer
- **Styles** - CSS styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Assessment Completion

This frontend application successfully implements all required features from the assessment:

### Phase 1: Setup & Authentication ✅
- React app created with Vite
- Dependencies installed (axios, react-router-dom)
- Basic routing set up
- Login page with form
- Login API call implemented
- JWT token stored in localStorage
- Protected routes implemented

### Phase 2: Product Listing ✅
- Products page created
- Products fetched from API
- Product list displayed with name, price, image
- Basic styling/layout
- Loading state
- Error handling

### Phase 3: Product Details & Cart ✅
- Product detail page/component
- Add to cart functionality
- Cart state management with Context
- Cart items count displayed

### Phase 4: Polish ✅
- Navigation bar with login/logout
- Error messages
- Styling improvements
- Responsive design

## Future Enhancements

Potential improvements for the future:
- User registration page
- Order history
- Product search and filtering
- Product reviews and ratings
- Wishlist functionality
- Payment integration
- User profile management
- Admin panel
- Image uploads
- Social sharing

## License

ISC

## Author

Built as part of the Marketplace Technical Assessment
