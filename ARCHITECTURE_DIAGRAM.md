# Application Architecture - Visual Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Requests/Responses
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                    http://localhost:5173                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Router                          │  │
│  │  /login  /products  /products/:id  /cart                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Context Providers (Global State)            │  │
│  │  ┌────────────────┐    ┌─────────────────┐              │  │
│  │  │  AuthContext   │    │  CartContext    │              │  │
│  │  │  - user        │    │  - cart[]       │              │  │
│  │  │  - login()     │    │  - addToCart()  │              │  │
│  │  │  - logout()    │    │  - updateQty()  │              │  │
│  │  └────────────────┘    └─────────────────┘              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Components                            │  │
│  │  Navbar  ProductCard  ProtectedRoute  etc.              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Service (services/api.js)               │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │         Axios Instance                           │    │  │
│  │  │  - Base URL: http://localhost:3000/api          │    │  │
│  │  │  - Request Interceptor (adds JWT token)         │    │  │
│  │  │  - Response Interceptor (handles errors)        │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Requests with JWT
                            │ (Authorization: Bearer <token>)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                    │
│                    http://localhost:3000                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Middleware Stack                      │  │
│  │  1. CORS          - Allow cross-origin requests         │  │
│  │  2. Body Parser   - Parse JSON bodies                   │  │
│  │  3. Routes        - Match URL patterns                  │  │
│  │  4. Auth          - Verify JWT tokens                   │  │
│  │  5. Controllers   - Business logic                      │  │
│  │  6. Error Handler - Catch and format errors             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes                            │  │
│  │  /api/auth         - Authentication                      │  │
│  │  /api/products     - Products CRUD                       │  │
│  │  /api/cart         - Shopping cart                       │  │
│  │  /api/orders       - Order management                    │  │
│  │  /api/categories   - Product categories                  │  │
│  │  /api/reviews      - Product reviews                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Controllers                           │  │
│  │  authController    - Register, login, profile            │  │
│  │  productController - CRUD operations                     │  │
│  │  cartController    - Add, update, remove items           │  │
│  │  orderController   - Create, view orders                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Database Layer (config/database.js)         │  │
│  │  In-memory storage using JavaScript arrays:             │  │
│  │  - users[]      - products[]    - categories[]          │  │
│  │  - orders[]     - reviews[]     - cart[]                │  │
│  │                                                          │  │
│  │  Methods: get, getById, create, update, delete          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow (JWT)

```
┌─────────┐                                               ┌─────────┐
│  USER   │                                               │ BACKEND │
└────┬────┘                                               └────┬────┘
     │                                                         │
     │ 1. Enter email & password                              │
     │────────────────────────────────────────────────────────>│
     │    POST /api/auth/login                                │
     │    { email, password }                                 │
     │                                                         │
     │                                   2. Verify credentials│
     │                                      (bcrypt.compare)   │
     │                                                         │
     │                                   3. Generate JWT token│
     │                                      (jwt.sign)         │
     │                                                         │
     │<────────────────────────────────────────────────────────│
     │    { success: true, data: { user, token } }           │
     │                                                         │
     │ 4. Store token in localStorage                         │
     │    localStorage.setItem('token', token)                │
     │                                                         │
     │ 5. All subsequent requests include token               │
     │────────────────────────────────────────────────────────>│
     │    GET /api/cart                                       │
     │    Headers: { Authorization: "Bearer <token>" }        │
     │                                                         │
     │                                  6. Verify token (JWT) │
     │                                     Extract user info   │
     │                                     req.user = decoded  │
     │                                                         │
     │<────────────────────────────────────────────────────────│
     │    { success: true, data: { cart } }                  │
     │                                                         │
```

### JWT Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6ImJ1eWVyIiwiaWF0IjoxNjkwMDAwMDAwLCJleHAiOjE2OTA2MDQ4MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header (Base64):                  Payload (Base64):                Signature (HMAC SHA256):
{                                 {                                 HMACSHA256(
  "alg": "HS256",                   "id": "user-123",                base64UrlEncode(header) + "." +
  "typ": "JWT"                      "email": "john@example.com",     base64UrlEncode(payload),
}                                   "role": "buyer",                 secret
                                    "iat": 1690000000,              )
                                    "exp": 1690604800
                                  }
```

---

## Request/Response Flow - Add to Cart Example

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │         │   Frontend   │         │   Backend   │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
       │ 1. Click "Add to Cart"│                        │
       │──────────────────────>│                        │
       │                       │                        │
       │                       │ 2. Call addToCart()    │
       │                       │    (CartContext)       │
       │                       │                        │
       │                       │ 3. Optimistic Update   │
       │                       │    setCart([...cart])  │
       │                       │                        │
       │                       │ 4. HTTP POST           │
       │                       │───────────────────────>│
       │                       │    /api/cart           │
       │                       │    Headers:            │
       │                       │    Authorization: Bearer│
       │                       │    Body:               │
       │                       │    {productId, quantity}│
       │                       │                        │
       │                       │                        │ 5. authenticate()
       │                       │                        │    Verify JWT
       │                       │                        │
       │                       │                        │ 6. addToCart()
       │                       │                        │    Controller
       │                       │                        │
       │                       │                        │ 7. db.addToCart()
       │                       │                        │    Save to DB
       │                       │                        │
       │                       │<───────────────────────│
       │                       │    { success, data }   │
       │                       │                        │
       │                       │ 8. Update confirmed    │
       │                       │                        │
       │<──────────────────────│                        │
       │ 9. UI Re-renders      │                        │
       │    Show success       │                        │
       │                       │                        │
```

**Timeline:** ~200-500ms total

---

## Component Hierarchy

```
App
├── Router
│   └── AuthProvider (Context)
│       └── CartProvider (Context)
│           ├── Navbar
│           │   ├── Logo
│           │   ├── SearchBar
│           │   ├── CartIcon (shows count from CartContext)
│           │   └── UserMenu (shows user from AuthContext)
│           │
│           └── Routes
│               ├── Route: /
│               │   └── Navigate to /products
│               │
│               ├── Route: /login
│               │   └── Login
│               │       ├── LoginForm
│               │       └── RegisterForm
│               │
│               ├── Route: /products
│               │   └── Products
│               │       ├── FilterSidebar
│               │       │   ├── CategoryFilter
│               │       │   ├── PriceFilter
│               │       │   └── SortDropdown
│               │       └── ProductGrid
│               │           └── ProductCard (multiple)
│               │               ├── ProductImage
│               │               ├── ProductInfo
│               │               └── AddToCartButton
│               │
│               ├── Route: /products/:id
│               │   └── ProductDetail
│               │       ├── ProductImages
│               │       ├── ProductInfo
│               │       ├── AddToCartButton
│               │       └── ReviewsList
│               │           └── ReviewCard (multiple)
│               │
│               └── Route: /cart (Protected)
│                   └── ProtectedRoute
│                       └── Cart
│                           ├── CartSummary
│                           ├── CartItems
│                           │   └── CartItem (multiple)
│                           │       ├── ProductInfo
│                           │       ├── QuantitySelector
│                           │       └── RemoveButton
│                           └── CheckoutButton
```

---

## State Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                     State Types                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Global State (Context API)                             │
│     ├── AuthContext                                        │
│     │   ├── user: { id, email, name, role }               │
│     │   ├── isAuthenticated: boolean                      │
│     │   ├── login(email, password)                        │
│     │   └── logout()                                      │
│     │                                                      │
│     └── CartContext                                       │
│         ├── cart: [{ product, quantity, price }]          │
│         ├── addToCart(product, quantity)                  │
│         ├── updateQuantity(productId, quantity)           │
│         ├── removeFromCart(productId)                     │
│         ├── getCartTotal()                                │
│         └── getCartCount()                                │
│                                                            │
│  2. Local Component State (useState)                      │
│     ├── Form inputs (email, password, search)             │
│     ├── UI state (loading, errors, modals)                │
│     ├── Temporary data (filters, sorting)                 │
│     └── Local toggles (dropdowns, accordions)             │
│                                                            │
│  3. Server State (API calls)                              │
│     ├── Products list (fetched, cached locally)           │
│     ├── Product details (fetched on-demand)               │
│     ├── Categories (fetched once, reused)                 │
│     └── Orders (fetched when needed)                      │
│                                                            │
│  4. Persistent State (localStorage)                       │
│     ├── JWT token (auth)                                  │
│     ├── User object (auth)                                │
│     └── Cart items (cart - offline support)               │
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYERS                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: UI Components (Presentation)                     │
│  ├── Display data                                          │
│  ├── Handle user interactions                              │
│  └── Trigger actions                                       │
│                                                             │
│  Layer 2: Context (State Management)                       │
│  ├── Manage global state                                   │
│  ├── Provide state to components                           │
│  └── Handle state updates                                  │
│                                                             │
│  Layer 3: Services (API Communication)                     │
│  ├── Make HTTP requests                                    │
│  ├── Handle responses                                      │
│  └── Error handling                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Routes (API Endpoints)                           │
│  ├── Define URL patterns                                   │
│  ├── Map HTTP methods                                      │
│  └── Apply middleware                                      │
│                                                             │
│  Layer 2: Middleware (Cross-cutting Concerns)              │
│  ├── Authentication (verify JWT)                           │
│  ├── Authorization (check roles)                           │
│  ├── Validation (check input)                              │
│  └── Error handling                                        │
│                                                             │
│  Layer 3: Controllers (Business Logic)                     │
│  ├── Process requests                                      │
│  ├── Apply business rules                                  │
│  ├── Coordinate data access                                │
│  └── Format responses                                      │
│                                                             │
│  Layer 4: Database (Data Persistence)                      │
│  ├── CRUD operations                                       │
│  ├── Data validation                                       │
│  └── Query optimization                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Middleware Chain Example

```
Incoming Request: POST /api/products
Headers: { Authorization: Bearer eyJ... }
Body: { name: "Laptop", price: 999 }

                    │
                    ▼
         ┌──────────────────┐
         │  express.json()  │  ──> Parse JSON body
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  authenticate    │  ──> Verify JWT token
         │  middleware      │      Extract user: { id, role }
         └────────┬─────────┘      Add to req.user
                  │
                  ▼
         ┌──────────────────┐
         │  authorize       │  ──> Check if role = 'seller'
         │  middleware      │      If not, return 403
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  createProduct   │  ──> Business logic
         │  controller      │      Create product
         └────────┬─────────┘      Save to DB
                  │
                  ▼
         ┌──────────────────┐
         │  Response        │  ──> { success: true, data: {...} }
         └──────────────────┘

If error at any step:
                  │
                  ▼
         ┌──────────────────┐
         │  errorHandler    │  ──> Format error
         │  middleware      │      Send response
         └──────────────────┘
```

---

## Database Schema (Conceptual)

```
┌───────────────────────────────────────────────────────────────┐
│                           USERS                               │
├───────────────────────────────────────────────────────────────┤
│  id: string (primary key)                                    │
│  email: string (unique)                                      │
│  password: string (hashed)                                   │
│  firstName: string                                           │
│  lastName: string                                            │
│  role: enum ['buyer', 'seller', 'admin']                    │
│  phone: string                                               │
│  address: object                                             │
│  createdAt: timestamp                                        │
└───────────────────────────────────────────────────────────────┘
                            │
                            │ 1:Many
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                         PRODUCTS                              │
├───────────────────────────────────────────────────────────────┤
│  id: string (primary key)                                    │
│  name: string                                                │
│  slug: string (unique)                                       │
│  description: string                                         │
│  price: number                                               │
│  compareAtPrice: number                                      │
│  categoryId: string (foreign key)                           │
│  sellerId: string (foreign key → users.id)                  │
│  images: array[string]                                       │
│  stock: number                                               │
│  status: enum ['active', 'inactive', 'draft']               │
│  rating: number                                              │
│  reviewCount: number                                         │
│  createdAt: timestamp                                        │
└───────────────────────────────────────────────────────────────┘
                            │
                            │ Many:1
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                        CATEGORIES                             │
├───────────────────────────────────────────────────────────────┤
│  id: string (primary key)                                    │
│  name: string                                                │
│  slug: string (unique)                                       │
│  description: string                                         │
│  image: string                                               │
│  parentId: string (self-reference)                          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                           CART                                │
├───────────────────────────────────────────────────────────────┤
│  id: string (primary key)                                    │
│  userId: string (foreign key → users.id)                     │
│  productId: string (foreign key → products.id)               │
│  quantity: number                                            │
│  addedAt: timestamp                                          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                         ORDERS                                │
├───────────────────────────────────────────────────────────────┤
│  id: string (primary key)                                    │
│  userId: string (foreign key → users.id)                     │
│  items: array[{ productId, quantity, price }]                │
│  totalAmount: number                                         │
│  status: enum ['pending', 'paid', 'shipped', 'delivered']   │
│  shippingAddress: object                                     │
│  createdAt: timestamp                                        │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                         REVIEWS                               │
├───────────────────────────────────────────────────────────────┤
│  id: string (primary key)                                    │
│  productId: string (foreign key → products.id)               │
│  userId: string (foreign key → users.id)                     │
│  rating: number (1-5)                                        │
│  title: string                                               │
│  comment: string                                             │
│  createdAt: timestamp                                        │
└───────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Development
```
┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │
│  localhost   │ ◄─────► │  localhost   │
│    :5173     │         │    :3000     │
└──────────────┘         └──────────────┘
```

### Production (Single Server)
```
                  ┌─────────────────┐
                  │   Domain/IP     │
                  │  your-app.com   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     Nginx       │
                  │  (Reverse Proxy)│
                  └────────┬────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
       ┌────────────────┐    ┌──────────────┐
       │   Static Files │    │  Node.js App │
       │   (React Build)│    │   (Express)  │
       │     Port 80    │    │   Port 3000  │
       └────────────────┘    └──────────────┘
```

### Production (Scalable)
```
┌────────────┐
│   Users    │
└──────┬─────┘
       │
       ▼
┌──────────────┐
│     CDN      │  ──> Static assets (images, CSS, JS)
│  CloudFront  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Frontend   │
│   (Vercel)   │  ──> React application
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
       ├──────────┬──────────┬──────────┐
       ▼          ▼          ▼          ▼
   ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
   │ API │    │ API │    │ API │    │ API │
   │ #1  │    │ #2  │    │ #3  │    │ #4  │
   └──┬──┘    └──┬──┘    └──┬──┘    └──┬──┘
      │          │          │          │
      └──────────┴──────────┴──────────┘
                 │
                 ▼
         ┌──────────────┐
         │   Database   │
         │   (MongoDB)  │
         └──────────────┘
                 │
                 ▼
         ┌──────────────┐
         │  Redis Cache │
         └──────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Transport Security                               │
│  └── HTTPS (TLS/SSL certificates)                          │
│                                                             │
│  Layer 2: Authentication                                    │
│  ├── Password hashing (bcrypt - 10 rounds)                 │
│  ├── JWT tokens (signed with secret)                       │
│  └── Token expiration (7 days)                             │
│                                                             │
│  Layer 3: Authorization                                     │
│  ├── Role-based access control (buyer/seller/admin)        │
│  ├── Resource ownership checks                             │
│  └── Protected routes                                      │
│                                                             │
│  Layer 4: Input Validation                                  │
│  ├── Backend validation (express-validator)                │
│  ├── Frontend validation (forms)                           │
│  ├── SQL injection prevention                              │
│  └── XSS prevention (React auto-escapes)                  │
│                                                             │
│  Layer 5: Rate Limiting                                     │
│  ├── API rate limiting (prevent brute force)               │
│  ├── Login attempt limiting                                │
│  └── DDoS protection                                       │
│                                                             │
│  Layer 6: CORS Policy                                       │
│  ├── Whitelist allowed origins                             │
│  ├── Restrict headers                                      │
│  └── Limit methods                                         │
│                                                             │
│  Layer 7: Error Handling                                    │
│  ├── Never expose stack traces in production               │
│  ├── Generic error messages                                │
│  └── Logging (but not sensitive data)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization Strategy

```
Frontend Optimizations:
├── Code Splitting
│   ├── Route-based splitting (React.lazy)
│   ├── Vendor bundle separation
│   └── Dynamic imports
│
├── Asset Optimization
│   ├── Image compression
│   ├── Lazy loading images
│   ├── WebP format
│   └── CDN delivery
│
├── React Optimizations
│   ├── React.memo (prevent re-renders)
│   ├── useMemo (expensive calculations)
│   ├── useCallback (stable function refs)
│   └── Virtual scrolling (long lists)
│
└── Caching
    ├── Service Workers (PWA)
    ├── Browser caching (Cache-Control headers)
    └── LocalStorage (cart, auth)

Backend Optimizations:
├── Database
│   ├── Indexing (id, email fields)
│   ├── Query optimization
│   └── Connection pooling
│
├── Caching
│   ├── Redis (sessions, frequently accessed data)
│   ├── Response caching
│   └── CDN (static assets)
│
├── API Design
│   ├── Pagination (limit results)
│   ├── Field selection (only return needed fields)
│   ├── Gzip compression
│   └── HTTP/2
│
└── Monitoring
    ├── Performance monitoring (New Relic, DataDog)
    ├── Error tracking (Sentry)
    └── Analytics (response times, error rates)
```

---

This visual guide should help you understand the complete architecture at a glance!
Use it alongside the INTERVIEW_GUIDE.md for comprehensive preparation.
