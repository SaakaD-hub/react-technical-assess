# Quick Start Guide - 5 Minutes to Running Application

## Prerequisites
- Node.js 16+ installed ([Download](https://nodejs.org/))
- Git installed
- Code editor (VS Code recommended)
- Terminal/Command prompt

---

## Step 1: Clone & Navigate (30 seconds)

```bash
# If not already in the project
cd react-technical-assess

# Verify you're in the right place
ls -la
# Should see: backend/ frontend/ README.md
```

---

## Step 2: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies (this takes ~1-2 minutes)
npm install

# Create environment file
touch .env

# Add this content to .env (or copy from below)
echo "PORT=3000
JWT_SECRET=my-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=development" > .env

# Verify .env was created
cat .env

# Start the backend server
npm run dev
```

**You should see:**
```
🌐 Server URL: http://localhost:3000
```

**Test it:** Open browser to http://localhost:3000
You should see a JSON response with API info.

**Keep this terminal running!** Open a new terminal for the next step.

---

## Step 3: Setup Frontend (2 minutes)

```bash
# In a NEW terminal, navigate to frontend
cd react-technical-assess/frontend

# Install dependencies (~1-2 minutes)
npm install

# Start development server
npm run dev
```

**You should see:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open browser to:** http://localhost:5173

---

## Step 4: Test the Application (1 minute)

### Test Login
1. Go to http://localhost:5173
2. Click "Login" in the navbar
3. Use test credentials:
   - **Email:** `john@example.com`
   - **Password:** `password123`
4. Click "Login"
5. You should be redirected to products page

### Test Products
1. Browse products on the main page
2. Try the search bar: search for "laptop"
3. Try filters: Select a category
4. Try sorting: Sort by price

### Test Cart
1. Click "Add to Cart" on any product
2. Click the Cart icon in navbar
3. You should see your item
4. Try updating quantity
5. Try removing item

**Success!** Your application is running. ✅

---

## Common Issues & Fixes

### Issue: "Port 3000 already in use"
```bash
# Find and kill the process
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=3001
```

### Issue: "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "CORS error"
**Solution:** Make sure backend is running on port 3000

### Issue: Frontend shows "Network Error"
**Solution:** Check backend is running:
```bash
curl http://localhost:3000/health
```

### Issue: Login doesn't work
**Solution:** Check backend logs for errors. Make sure JWT_SECRET is set in .env

---

## Project Structure Overview

```
react-technical-assess/
│
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── server.js          # Entry point
│   │   ├── config/
│   │   │   └── database.js    # In-memory database
│   │   ├── controllers/       # Business logic
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── cartController.js
│   │   ├── middleware/        # Authentication, error handling
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/            # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── cartRoutes.js
│   │   └── data/
│   │       └── mockData.js    # Sample data
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── main.jsx           # Entry point
│   │   ├── App.jsx            # Main component
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── Cart.jsx
│   │   ├── context/           # Global state
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   └── services/
│   │       └── api.js         # API calls
│   └── package.json
│
├── INTERVIEW_GUIDE.md         # Comprehensive interview prep
├── DEPLOYMENT_CHECKLIST.md    # Deployment guide
└── QUICK_START.md            # This file
```

---

## Available API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/profile       # Get user profile (protected)
PUT    /api/auth/profile       # Update profile (protected)
```

### Products
```
GET    /api/products           # Get all products (with filters)
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product (seller only)
PUT    /api/products/:id       # Update product (seller only)
DELETE /api/products/:id       # Delete product (seller only)
```

### Cart
```
GET    /api/cart               # Get user's cart (protected)
POST   /api/cart               # Add item to cart (protected)
PUT    /api/cart/:productId    # Update item quantity (protected)
DELETE /api/cart/:productId    # Remove item (protected)
DELETE /api/cart               # Clear cart (protected)
```

### Categories
```
GET    /api/categories         # Get all categories
GET    /api/categories/:id     # Get single category
```

### Orders
```
GET    /api/orders             # Get user's orders (protected)
GET    /api/orders/:id         # Get single order (protected)
POST   /api/orders             # Create order (protected)
PUT    /api/orders/:id/status  # Update order status (seller/admin)
```

### Reviews
```
GET    /api/reviews            # Get all reviews
POST   /api/reviews            # Create review (protected)
PUT    /api/reviews/:id        # Update review (protected)
DELETE /api/reviews/:id        # Delete review (protected)
```

---

## Test Credentials

### Buyer Account
```
Email: john@example.com
Password: password123
Role: buyer
```

### Seller Account
```
Email: jane@example.com
Password: password123
Role: seller
```

### Admin Account
```
Email: admin@example.com
Password: password123
Role: admin
```

---

## Testing API with cURL

```bash
# Health check
curl http://localhost:3000/health

# Get all products
curl http://localhost:3000/api/products

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get products with filters
curl "http://localhost:3000/api/products?category=electronics&sort=price_asc"

# Get cart (replace TOKEN with actual JWT)
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Testing API with Postman/Thunder Client

### 1. Login Request
```
Method: POST
URL: http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Copy the `token` from response.

### 2. Get Cart (Protected)
```
Method: GET
URL: http://localhost:3000/api/cart
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Add to Cart
```
Method: POST
URL: http://localhost:3000/api/cart
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "productId": "prod-1",
  "quantity": 2
}
```

---

## Development Workflow

### Making Changes

**Backend changes:**
1. Edit files in `backend/src/`
2. Server auto-restarts (using `--watch` flag)
3. Test changes at http://localhost:3000

**Frontend changes:**
1. Edit files in `frontend/src/`
2. Vite auto-reloads browser
3. See changes at http://localhost:5173

### Debugging

**Backend:**
```bash
# View server logs in terminal where you ran `npm run dev`
# Or add console.log() in controllers
console.log('Debug:', variable);
```

**Frontend:**
```bash
# Open browser DevTools (F12)
# Check Console tab for errors
# Check Network tab for API calls
# Add console.log() in components
console.log('State:', state);
```

---

## Next Steps

1. **Read INTERVIEW_GUIDE.md** - Comprehensive prep for your interview
2. **Read DEPLOYMENT_CHECKLIST.md** - Learn how to deploy
3. **Explore the code** - Start with:
   - `backend/src/server.js` - Backend entry
   - `frontend/src/App.jsx` - Frontend entry
   - `frontend/src/services/api.js` - API calls
4. **Try making changes** - Add a new feature or modify existing ones
5. **Practice explaining** - Walk through the code out loud

---

## Stopping the Application

```bash
# In each terminal (backend and frontend), press:
Ctrl + C

# Or if running in background:
# Find processes
ps aux | grep node

# Kill process
kill -9 <PID>
```

---

## Useful VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Quick React components
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Thunder Client** - API testing (Postman alternative)
- **GitLens** - Git integration
- **Auto Rename Tag** - Rename HTML tags
- **Path Intellisense** - Autocomplete file paths

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Start development server
npm start               # Start production server

# Frontend
cd frontend
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Both
npm install              # After pulling new code
```

---

## Interview Day Checklist

- [ ] Application runs without errors
- [ ] Can login with test credentials
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Understand architecture (read INTERVIEW_GUIDE.md)
- [ ] Can explain authentication flow
- [ ] Can explain state management
- [ ] Know how to deploy (read DEPLOYMENT_CHECKLIST.md)
- [ ] Prepared to discuss improvements
- [ ] Have questions ready for interviewer

---

Good luck! You've got this! 🚀

For detailed explanations, see **INTERVIEW_GUIDE.md**
For deployment help, see **DEPLOYMENT_CHECKLIST.md**
