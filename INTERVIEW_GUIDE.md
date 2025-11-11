# Complete Marketplace Application - Interview Preparation Guide

## Table of Contents
1. [Application Overview](#application-overview)
2. [Backend Architecture (Node.js/Express)](#backend-architecture)
3. [Frontend Architecture (React)](#frontend-architecture)
4. [Data Flow: Backend → Frontend](#data-flow-backend--frontend)
5. [Clean Code & Maintainability Practices](#clean-code--maintainability-practices)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Guide](#deployment-guide)
8. [Key Interview Points](#key-interview-points)

---

## Application Overview

**What is this application?**
A full-stack e-commerce marketplace where:
- Users can browse products, add them to cart, and place orders
- Sellers can create and manage their products
- Admins can manage the entire platform

**Tech Stack:**
- **Backend**: Node.js + Express.js (REST API)
- **Frontend**: React 18 + Vite
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: In-memory (arrays) - simulates a real database

---

## Backend Architecture (Node.js/Express)

### 1. Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # In-memory database
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/              # Request interceptors
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/                  # API endpoints
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── cartRoutes.js
│   ├── data/
│   │   └── mockData.js          # Sample data
│   └── server.js                # Application entry point
└── package.json
```

### 2. Entry Point - server.js

**What it does:** Initializes the Express server, sets up middleware, and connects routes.

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE - Functions that run before reaching routes
app.use(cors());                          // Allow cross-origin requests
app.use(express.json());                  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ROUTES - Define API endpoints
app.use('/api/auth', authRoutes);         // Authentication endpoints
app.use('/api/products', productRoutes);  // Product endpoints
app.use('/api/cart', cartRoutes);         // Cart endpoints

// ERROR HANDLING
app.use(notFound);                        // Handle 404 errors
app.use(errorHandler);                    // Handle all other errors

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Key Concepts:**
- **Middleware**: Functions that execute before your route handlers
- **Routes**: Define URL paths and HTTP methods (GET, POST, PUT, DELETE)
- **Port**: The server listens on port 3000

---

### 3. Database Layer - config/database.js

**What it does:** Simulates a database using JavaScript arrays.

```javascript
// In-memory storage (like a simple database)
let users = [];
let products = [];
let categories = [];
let orders = [];
let cart = [];

const db = {
  // USER OPERATIONS
  getUsers: () => users,
  getUserById: (id) => users.find(u => u.id === id),
  getUserByEmail: (email) => users.find(u => u.email === email),
  createUser: (user) => {
    users.push(user);
    return user;
  },

  // PRODUCT OPERATIONS
  getProducts: () => products,
  getProductById: (id) => products.find(p => p.id === id),
  createProduct: (product) => {
    products.push(product);
    return product;
  },

  // CART OPERATIONS
  getCartByUser: (userId) => cart.filter(c => c.userId === userId),
  addToCart: (item) => {
    cart.push(item);
    return item;
  },
};

export default db;
```

**Why arrays?**
- Simple for demonstration
- In production, you'd use MongoDB, PostgreSQL, etc.
- Same interface - just swap the implementation

**CRUD Operations:** Create, Read, Update, Delete

---

### 4. Authentication - controllers/authController.js

**What it does:** Handles user registration and login.

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

// REGISTER NEW USER
export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // 1. CHECK if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // 2. HASH PASSWORD (never store plain text passwords!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. CREATE USER
    const user = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'buyer',
      createdAt: new Date().toISOString(),
    };

    db.createUser(user);

    // 4. GENERATE JWT TOKEN
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. SEND RESPONSE (remove password!)
    const { password: _, ...userResponse } = user;
    res.status(201).json({
      success: true,
      data: { user: userResponse, token }
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN USER
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. FIND USER
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 2. VERIFY PASSWORD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 3. GENERATE TOKEN
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. SEND RESPONSE
    const { password: _, ...userResponse } = user;
    res.json({
      success: true,
      data: { user: userResponse, token }
    });
  } catch (error) {
    next(error);
  }
};
```

**Security Best Practices:**
1. **Password Hashing**: Use bcrypt to encrypt passwords
2. **JWT Tokens**: Secure, stateless authentication
3. **Never return passwords**: Always exclude from responses
4. **Generic error messages**: Don't reveal if email exists

**JWT Token Structure:**
```
Header.Payload.Signature
eyJhbGci0iJIUzI1NiIsIn.eyJpZCI6InVzZXItMTIzIiw.SflKxwRJSMeKKF2QT4f
```

---

### 5. Middleware - middleware/auth.js

**What it does:** Protects routes by verifying JWT tokens.

```javascript
import jwt from 'jsonwebtoken';

// AUTHENTICATION MIDDLEWARE
export const authenticate = (req, res, next) => {
  try {
    // 1. EXTRACT TOKEN from Authorization header
    // Format: "Bearer eyJhbGci0iJIUzI1..."
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // 2. VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. ATTACH USER to request object
    req.user = decoded;  // Now available in controllers

    // 4. CONTINUE to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// AUTHORIZATION MIDDLEWARE
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission'
      });
    }
    next();
  };
};
```

**Usage in routes:**
```javascript
import { authenticate, authorize } from '../middleware/auth.js';

// Public route - anyone can access
router.get('/products', getProducts);

// Protected route - must be logged in
router.get('/cart', authenticate, getCart);

// Role-based route - only sellers can create products
router.post('/products', authenticate, authorize('seller', 'admin'), createProduct);
```

**Middleware Chain:**
```
Request → authenticate → authorize → controller → Response
```

---

### 6. Controllers - controllers/productController.js

**What it does:** Handles all product-related business logic.

```javascript
import db from '../config/database.js';

// GET ALL PRODUCTS with filters and pagination
export const getProducts = (req, res, next) => {
  try {
    // 1. EXTRACT QUERY PARAMETERS
    const {
      category,      // Filter by category
      search,        // Search term
      minPrice,      // Price range
      maxPrice,
      sort,          // Sorting option
      page = 1,      // Pagination
      limit = 20
    } = req.query;

    let products = db.getProducts();

    // 2. APPLY FILTERS
    if (category) {
      products = products.filter(p => p.categoryId === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // 3. APPLY SORTING
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    // 4. PAGINATION
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    // 5. SEND RESPONSE
    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          pages: Math.ceil(products.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT
export const getProductById = (req, res, next) => {
  try {
    const product = db.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get reviews for this product
    const reviews = db.getReviewsByProduct(req.params.id);

    res.json({
      success: true,
      data: { ...product, reviews }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE PRODUCT (sellers only)
export const createProduct = (req, res, next) => {
  try {
    const { name, description, price, categoryId, stock } = req.body;

    // 1. CHECK if user is a seller
    const user = db.getUserById(req.user.id);
    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can create products'
      });
    }

    // 2. CREATE PRODUCT
    const product = {
      id: `prod-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      price: parseFloat(price),
      categoryId,
      sellerId: req.user.id,  // From JWT token
      stock: parseInt(stock),
      status: 'active',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    db.createProduct(product);

    // 3. SEND RESPONSE
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};
```

**Key Patterns:**
- **Try-Catch**: Error handling for all operations
- **Query Parameters**: Flexible filtering and pagination
- **Status Codes**: 200 (OK), 201 (Created), 404 (Not Found), etc.
- **Consistent Response**: Always include `success` and `data/message`

---

### 7. Error Handling - middleware/errorHandler.js

**What it does:** Catches and formats all errors.

```javascript
// 404 Handler - Route not found
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  // Default to 500 if status not set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
```

**Usage:**
```javascript
// In server.js (must be LAST middleware)
app.use(notFound);
app.use(errorHandler);
```

---

## Frontend Architecture (React)

### 1. Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Page components (routes)
│   │   ├── Login.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   └── Cart.jsx
│   ├── context/            # Global state management
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── services/           # API calls
│   │   └── api.js
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
└── package.json
```

### 2. Entry Point - main.jsx

**What it does:** Renders the React app to the DOM.

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Render app to <div id="root">
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### 3. App Component - App.jsx

**What it does:** Sets up routing and context providers.

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      {/* CONTEXT PROVIDERS - Make state available to all components */}
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />

            {/* ROUTES - Different pages */}
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* PROTECTED ROUTE - Requires authentication */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
```

**Component Hierarchy:**
```
App
├── AuthProvider (provides auth state)
│   └── CartProvider (provides cart state)
│       ├── Navbar
│       └── Routes
│           ├── Login
│           ├── Products
│           ├── ProductDetail
│           └── Cart (protected)
```

---

### 4. API Service - services/api.js

**What it does:** Centralizes all HTTP requests to the backend.

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// CREATE AXIOS INSTANCE
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - Add token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Add Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired (401), redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// PRODUCTS API
export const productsAPI = {
  getAll: async (params = {}) => {
    // params: { category, search, minPrice, maxPrice, sort, page, limit }
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
};

// CART API
export const cartAPI = {
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  add: async (productId, quantity = 1) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  update: async (productId, quantity) => {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  remove: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },
};
```

**Why Interceptors?**
- **Automatic token injection**: Don't need to add token to every request
- **Centralized error handling**: Handle auth errors in one place
- **DRY Principle**: Don't Repeat Yourself

---

### 5. Authentication Context - context/AuthContext.jsx

**What it does:** Manages authentication state globally.

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// 1. CREATE CONTEXT
const AuthContext = createContext(null);

// 2. PROVIDER COMPONENT
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. CHECK IF USER IS LOGGED IN (on mount)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // 4. LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);

      if (response.success && response.data) {
        const { token, user } = response.data;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Update state
        setUser(user);

        return { success: true };
      }

      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // 5. LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 6. REGISTER FUNCTION
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // 7. PROVIDE VALUES to all children
  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,  // Boolean: true if user exists
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 8. CUSTOM HOOK for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Usage in Components:**
```javascript
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      navigate('/products');
    }
  };

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/products" />;
  }

  return <form onSubmit={handleLogin}>...</form>;
}
```

**Context API Benefits:**
- **Global state**: Access anywhere in the app
- **No prop drilling**: Don't pass props through many levels
- **Persistent**: Survives page refreshes (with localStorage)

---

### 6. Cart Context - context/CartContext.jsx

**What it does:** Manages shopping cart state globally.

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // 1. LOAD CART from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // 2. SAVE CART to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 3. SYNC with backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncCartWithBackend();
    }
  }, [isAuthenticated]);

  const syncCartWithBackend = async () => {
    try {
      const response = await cartAPI.get();
      if (response.success && response.data?.cart?.items) {
        setCart(response.data.cart.items);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  // 4. ADD TO CART
  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if already in cart
      const existingItem = cart.find(item => item.product?.id === product.id);

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        await updateQuantity(product.id, newQuantity);
      } else {
        // Add new item
        const newItem = {
          product,
          quantity,
          price: product.price,
        };

        setCart(prev => [...prev, newItem]);

        // Sync with backend if logged in
        if (isAuthenticated) {
          await cartAPI.add(product.id, quantity);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to add item' };
    }
  };

  // 5. UPDATE QUANTITY
  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      // Update local state
      setCart(prev =>
        prev.map(item =>
          item.product?.id === productId
            ? { ...item, quantity }
            : item
        )
      );

      // Sync with backend
      if (isAuthenticated) {
        await cartAPI.update(productId, quantity);
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to update' };
    }
  };

  // 6. REMOVE FROM CART
  const removeFromCart = async (productId) => {
    try {
      setCart(prev => prev.filter(item => item.product?.id !== productId));

      if (isAuthenticated) {
        await cartAPI.remove(productId);
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to remove' };
    }
  };

  // 7. CLEAR CART
  const clearCart = async () => {
    try {
      setCart([]);

      if (isAuthenticated) {
        await cartAPI.clear();
      }

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // 8. CALCULATE TOTAL
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // 9. GET ITEM COUNT
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

**Cart Logic:**
1. **Local First**: Store in localStorage for persistence
2. **Backend Sync**: Sync with server if logged in
3. **Optimistic Updates**: Update UI immediately, sync later

---

### 7. Protected Route - components/ProtectedRoute.jsx

**What it does:** Redirects to login if not authenticated.

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Wait for auth check to complete
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected component
  return children;
}

export default ProtectedRoute;
```

**Usage:**
```javascript
<Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>
```

---

### 8. Products Page - pages/Products.jsx

**What it does:** Displays all products with filters.

```javascript
import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

function Products() {
  // STATE
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });

  // FETCH PRODUCTS on mount and filter change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // FETCH CATEGORIES on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll(filters);
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="products-page">
      {/* FILTERS */}
      <aside className="filters">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </aside>

      {/* PRODUCTS GRID */}
      <main className="products-grid">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </main>
    </div>
  );
}

export default Products;
```

**React Hooks Used:**
- **useState**: Manage component state
- **useEffect**: Side effects (API calls, subscriptions)

---

## Data Flow: Backend → Frontend

### Complete Request/Response Flow

```
USER ACTION
    ↓
FRONTEND (React)
    ↓
API Service (axios)
    ↓
HTTP Request with JWT Token
    ↓
BACKEND (Express)
    ↓
Middleware (authenticate)
    ↓
Route Handler
    ↓
Controller
    ↓
Database (in-memory)
    ↓
Response JSON
    ↓
API Service
    ↓
Context/State Update
    ↓
Component Re-render
    ↓
USER SEES RESULT
```

### Example: Adding Product to Cart

**1. User clicks "Add to Cart"**
```javascript
// ProductCard.jsx
const { addToCart } = useCart();

const handleAddToCart = async () => {
  const result = await addToCart(product, 1);
  if (result.success) {
    alert('Added to cart!');
  }
};
```

**2. CartContext processes request**
```javascript
// CartContext.jsx
const addToCart = async (product, quantity) => {
  // Update local state immediately (optimistic update)
  setCart(prev => [...prev, { product, quantity }]);

  // Sync with backend
  if (isAuthenticated) {
    await cartAPI.add(product.id, quantity);
  }
};
```

**3. API Service sends request**
```javascript
// api.js
export const cartAPI = {
  add: async (productId, quantity) => {
    // Axios interceptor automatically adds JWT token
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  }
};
```

**4. Backend receives request**
```javascript
// cartRoutes.js
router.post('/', authenticate, addToCart);
```

**5. Middleware verifies token**
```javascript
// auth.js
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;  // Attach user info
  next();
};
```

**6. Controller processes logic**
```javascript
// cartController.js
export const addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;  // From JWT token

  const product = db.getProductById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const cartItem = {
    id: `cart-${Date.now()}`,
    userId,
    productId,
    quantity,
    addedAt: new Date().toISOString()
  };

  db.addToCart(cartItem);

  res.json({
    success: true,
    message: 'Item added to cart',
    data: cartItem
  });
};
```

**7. Response flows back to frontend**
```javascript
// CartContext receives response
// UI automatically updates (React re-renders)
```

---

## Clean Code & Maintainability Practices

### 1. Separation of Concerns

**Backend Structure:**
```
Routes         → Define endpoints (URL + HTTP method)
Controllers    → Business logic
Database       → Data access
Middleware     → Cross-cutting concerns
```

**Frontend Structure:**
```
Components     → UI elements
Pages          → Route components
Context        → Global state
Services       → API calls
```

**Why?** Each file has ONE responsibility. Easy to find and modify.

---

### 2. DRY Principle (Don't Repeat Yourself)

**Bad:**
```javascript
// Repeating API calls everywhere
const response = await axios.get('http://localhost:3000/api/products');
const response2 = await axios.get('http://localhost:3000/api/cart');
```

**Good:**
```javascript
// Centralized API service
import { productsAPI, cartAPI } from './services/api';
const response = await productsAPI.getAll();
const response2 = await cartAPI.get();
```

---

### 3. Consistent Error Handling

**Backend:**
```javascript
// All controllers use try-catch
export const getProducts = (req, res, next) => {
  try {
    // Logic here
  } catch (error) {
    next(error);  // Pass to error handler middleware
  }
};
```

**Frontend:**
```javascript
// All API calls return consistent format
try {
  const response = await authAPI.login(email, password);
  if (response.success) {
    // Handle success
  } else {
    // Handle failure
  }
} catch (error) {
  // Handle network errors
}
```

---

### 4. Environment Variables

**Backend (.env):**
```
PORT=3000
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Usage:**
```javascript
const token = jwt.sign(payload, process.env.JWT_SECRET);
```

**Why?**
- Security: Keep secrets out of code
- Flexibility: Different values for dev/staging/production
- Never commit .env to git

---

### 5. Consistent Response Format

**All API responses follow same structure:**
```javascript
// Success response
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}

// Error response
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development
}
```

**Benefits:**
- Frontend knows what to expect
- Easy error handling
- Predictable structure

---

### 6. Naming Conventions

**Variables & Functions:**
```javascript
// camelCase
const userName = 'John';
const fetchProducts = async () => {};
```

**Components:**
```javascript
// PascalCase
function ProductCard() {}
export default ProductCard;
```

**Constants:**
```javascript
// SCREAMING_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000';
const MAX_RETRY_ATTEMPTS = 3;
```

**Files:**
```
authController.js    (camelCase for utilities)
ProductCard.jsx      (PascalCase for components)
```

---

### 7. Code Documentation

**Function Comments:**
```javascript
/**
 * Authenticates user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object and JWT token
 */
export const login = async (email, password) => {
  // Implementation
};
```

**Inline Comments:**
```javascript
// Hash password before storing (never store plain text!)
const hashedPassword = await bcrypt.hash(password, 10);
```

---

### 8. Validation

**Backend (express-validator):**
```javascript
import { body, validationResult } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  body('firstName').notEmpty().withMessage('First name required')
];

// In route
router.post('/register', registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Proceed with registration
});
```

**Frontend:**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();

  // Validation
  if (!email || !password) {
    setError('All fields required');
    return;
  }

  if (password.length < 6) {
    setError('Password must be 6+ characters');
    return;
  }

  // Proceed
};
```

---

## Testing Strategy

### 1. Backend Testing (with Jest/Mocha)

**Unit Tests - Controllers:**
```javascript
// productController.test.js
import { getProducts } from '../controllers/productController';

describe('Product Controller', () => {
  describe('getProducts', () => {
    it('should return all products', async () => {
      const req = { query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn(() => res)
      };

      await getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Object)
        })
      );
    });

    it('should filter products by category', async () => {
      const req = { query: { category: 'electronics' } };
      const res = { json: jest.fn() };

      await getProducts(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ categoryId: 'electronics' })
        ])
      );
    });
  });
});
```

**Integration Tests - API Endpoints:**
```javascript
// api.test.js
import request from 'supertest';
import app from '../server';

describe('Auth API', () => {
  it('POST /api/auth/register - should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('id');
  });

  it('POST /api/auth/login - should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });
});
```

**Middleware Tests:**
```javascript
// auth.test.js
import { authenticate } from '../middleware/auth';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  it('should authenticate valid token', () => {
    const token = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET);
    const req = {
      headers: { authorization: `Bearer ${token}` }
    };
    const res = {};
    const next = jest.fn();

    authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user-1');
    expect(next).toHaveBeenCalled();
  });

  it('should reject invalid token', () => {
    const req = {
      headers: { authorization: 'Bearer invalid-token' }
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

---

### 2. Frontend Testing (with React Testing Library)

**Component Tests:**
```javascript
// ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';

describe('ProductCard', () => {
  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    price: 29.99,
    image: 'test.jpg'
  };

  it('should render product details', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('should add to cart when button clicked', async () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);

    // Verify cart updated (would need to check context state)
  });
});
```

**Context Tests:**
```javascript
// AuthContext.test.jsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

describe('AuthContext', () => {
  it('should login user', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.login('test@example.com', 'password');
      expect(response.success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('should logout user', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

---

### 3. Test Coverage Goals

```
Unit Tests          → 80%+ coverage
Integration Tests   → All critical paths
E2E Tests          → Main user flows
```

**Critical Test Cases:**

**Authentication:**
- ✅ User can register
- ✅ User can login
- ✅ Invalid credentials rejected
- ✅ Token expires after time
- ✅ Protected routes require auth

**Products:**
- ✅ Fetch all products
- ✅ Filter by category
- ✅ Search by name
- ✅ Sort by price
- ✅ Pagination works

**Cart:**
- ✅ Add item to cart
- ✅ Update quantity
- ✅ Remove item
- ✅ Calculate total correctly
- ✅ Persist across refreshes

**Orders:**
- ✅ Create order
- ✅ View order history
- ✅ Update order status

---

## Deployment Guide

### 1. Local Development

**Start Backend:**
```bash
cd backend
npm install
npm run dev    # Runs on http://localhost:3000
```

**Start Frontend:**
```bash
cd frontend
npm install
npm run dev    # Runs on http://localhost:5173
```

---

### 2. Environment Setup

**Backend .env:**
```
PORT=3000
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend (vite.config.js):**
```javascript
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

---

### 3. Production Build

**Build Frontend:**
```bash
cd frontend
npm run build    # Creates dist/ folder
```

**Serve Static Files from Backend:**
```javascript
// server.js
import path from 'path';

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

---

### 4. Deploy to Cloud

**Option 1: Heroku**

**Create Procfile:**
```
web: cd backend && npm start
```

**Deploy:**
```bash
git init
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
heroku config:set JWT_SECRET=your-secret
heroku open
```

---

**Option 2: AWS EC2**

**1. Launch EC2 Instance (Ubuntu)**

**2. Connect and Setup:**
```bash
# Connect
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install git

# Clone repo
git clone your-repo-url
cd your-repo

# Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# Install PM2 (process manager)
sudo npm install -g pm2

# Start backend
cd backend
pm2 start src/server.js --name marketplace-api

# Setup nginx as reverse proxy
sudo apt-get install nginx
```

**3. Configure Nginx (/etc/nginx/sites-available/default):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/ubuntu/your-repo/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**4. Restart Nginx:**
```bash
sudo systemctl restart nginx
```

---

**Option 3: Vercel (Frontend) + Render (Backend)**

**Deploy Backend to Render:**
1. Create account at render.com
2. New Web Service → Connect GitHub repo
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add Environment Variables

**Deploy Frontend to Vercel:**
```bash
npm install -g vercel
cd frontend
vercel    # Follow prompts
```

**Update API URL:**
```javascript
// frontend/src/services/api.js
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';
```

---

### 5. Environment Variables in Production

**Backend:**
```
PORT=3000
JWT_SECRET=super-secure-random-string-minimum-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=production
DATABASE_URL=your-db-connection-string
```

**Frontend:**
```
VITE_API_URL=https://your-backend.com/api
```

---

### 6. Monitoring & Logging

**PM2 Logs:**
```bash
pm2 logs marketplace-api
pm2 monit
```

**Error Tracking (Sentry):**
```javascript
// server.js
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN });

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## Key Interview Points

### Backend Questions & Answers

**Q: Explain the architecture of your backend.**
```
A: "I used a layered architecture:
   - Routes define endpoints
   - Middleware handles authentication and validation
   - Controllers contain business logic
   - Database layer abstracts data access

   This separation makes the code modular, testable, and maintainable."
```

**Q: How does authentication work?**
```
A: "I implemented JWT-based authentication:
   1. User logs in with credentials
   2. Backend verifies and generates JWT token
   3. Token is sent to frontend
   4. Frontend includes token in all requests
   5. Middleware verifies token before protected routes

   Benefits: Stateless, scalable, no server-side sessions."
```

**Q: How do you handle errors?**
```
A: "I use centralized error handling:
   - All controllers use try-catch
   - Errors are passed to error middleware via next(error)
   - Error middleware formats response consistently
   - Different status codes for different error types
   - Stack traces only shown in development"
```

**Q: How would you add a real database?**
```
A: "I'd use MongoDB with Mongoose:
   1. Install mongoose
   2. Create models (schemas)
   3. Replace db.getProducts() with Product.find()
   4. Add connection in config/database.js
   5. Handle async operations with async/await

   The controller logic stays mostly the same!"
```

**Q: How do you secure API endpoints?**
```
A: "Multiple layers:
   - JWT authentication middleware
   - Role-based authorization
   - Input validation (express-validator)
   - Password hashing (bcrypt)
   - CORS configuration
   - Rate limiting (express-rate-limit)
   - HTTPS in production
   - Environment variables for secrets"
```

---

### Frontend Questions & Answers

**Q: Why did you use Context API instead of Redux?**
```
A: "Context API is sufficient for this app's complexity:
   - Simpler setup, less boilerplate
   - Built into React
   - Adequate for moderate state needs

   I'd use Redux if:
   - Very complex state
   - Need middleware (sagas, thunks)
   - Time-travel debugging required
   - Team prefers it"
```

**Q: Explain your state management strategy.**
```
A: "I use a combination:
   - Global state: Context API (auth, cart)
   - Local state: useState (forms, UI toggles)
   - Server state: Fetch in useEffect
   - Persistence: localStorage

   Each has its purpose - use the right tool for the job."
```

**Q: How do you handle API calls?**
```
A: "I created a centralized API service:
   - Axios instance with base URL
   - Request interceptor adds JWT token
   - Response interceptor handles 401 errors
   - Consistent error handling
   - Easy to modify all requests at once

   This follows DRY principle."
```

**Q: What is useEffect and when do you use it?**
```
A: "useEffect handles side effects in functional components:
   - API calls
   - Subscriptions
   - DOM manipulation
   - localStorage sync

   Dependency array controls when it runs:
   - [] = only on mount
   - [var] = when var changes
   - no array = every render"
```

**Q: How would you optimize performance?**
```
A: "Several strategies:
   - React.memo for expensive components
   - useMemo for expensive calculations
   - useCallback to prevent re-renders
   - Lazy loading with React.lazy
   - Code splitting
   - Virtual scrolling for long lists
   - Debouncing search inputs
   - Image optimization
   - CDN for static assets"
```

---

### General Questions & Answers

**Q: Walk me through the full data flow.**
```
A: "Let's trace adding a product to cart:
   1. User clicks 'Add to Cart' in ProductCard
   2. Calls addToCart from CartContext
   3. CartContext updates local state (optimistic update)
   4. Calls cartAPI.add (axios)
   5. Axios adds JWT token via interceptor
   6. Request sent to backend /api/cart
   7. Backend authenticate middleware verifies token
   8. Controller processes request, updates database
   9. Response sent back to frontend
   10. Context confirms success, UI updates

   Total time: ~200ms"
```

**Q: How do you ensure code quality?**
```
A: "Multiple practices:
   - Consistent naming conventions
   - Separation of concerns
   - DRY principle
   - Code comments where needed
   - Error handling everywhere
   - Input validation
   - ESLint for linting
   - Prettier for formatting
   - Pull request reviews
   - Unit and integration tests"
```

**Q: What would you improve given more time?**
```
A: "Several areas:
   - Replace in-memory DB with MongoDB/PostgreSQL
   - Add comprehensive test suite
   - Implement caching (Redis)
   - Add image uploads (S3)
   - Real-time features (WebSockets)
   - Admin dashboard
   - Email notifications
   - Payment integration (Stripe)
   - Better error messages
   - Loading skeletons
   - Accessibility improvements
   - SEO optimization"
```

**Q: How do you handle security?**
```
A: "Defense in depth:

   Backend:
   - Password hashing (bcrypt)
   - JWT authentication
   - Input validation
   - SQL injection prevention
   - CORS policy
   - Rate limiting
   - HTTPS only in production

   Frontend:
   - XSS prevention (React auto-escapes)
   - CSRF tokens
   - Secure localStorage usage
   - No sensitive data in URLs
   - Input sanitization"
```

---

## Quick Reference Commands

**Backend:**
```bash
npm install              # Install dependencies
npm run dev             # Development server
npm start               # Production server
npm test                # Run tests
```

**Frontend:**
```bash
npm install              # Install dependencies
npm run dev             # Development server (http://localhost:5173)
npm run build           # Production build
npm run preview         # Preview production build
```

**Git:**
```bash
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push origin main    # Push to remote
```

---

## Interview Preparation Checklist

- [ ] Can explain overall architecture
- [ ] Understand data flow from frontend to backend
- [ ] Know how authentication works (JWT)
- [ ] Can explain Context API
- [ ] Understand React hooks (useState, useEffect)
- [ ] Know how middleware works
- [ ] Can discuss clean code practices
- [ ] Familiar with deployment options
- [ ] Can identify security measures
- [ ] Ready to discuss improvements
- [ ] Practiced explaining code samples
- [ ] Know testing strategies

---

## Sample Code Snippets for Demo

**1. Show Authentication Flow:**
Point to: `backend/src/controllers/authController.js:60-102` (login function)
Then: `frontend/src/context/AuthContext.jsx:27-46` (login in React)

**2. Show Middleware:**
Point to: `backend/src/middleware/auth.js:3-23` (authenticate function)

**3. Show API Service:**
Point to: `frontend/src/services/api.js:14-25` (interceptors)

**4. Show Context Pattern:**
Point to: `frontend/src/context/CartContext.jsx:7-178` (full context)

**5. Show Controller Logic:**
Point to: `backend/src/controllers/productController.js:3-71` (getProducts with filters)

---

## Final Tips for Interview

1. **Start with the big picture** - explain architecture first
2. **Use code examples** - reference specific files
3. **Explain your reasoning** - why you made certain choices
4. **Admit unknowns** - "I haven't implemented that yet, but I'd approach it by..."
5. **Show enthusiasm** - talk about what you enjoyed building
6. **Ask questions** - about their tech stack, challenges, etc.

Good luck with your interview! 🚀
