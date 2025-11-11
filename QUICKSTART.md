# Marketplace Application - Quick Start Guide

## 🚀 Status: RUNNING

Both servers are currently running and ready to use!

### Server URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 🔑 Test Credentials

Use these credentials to log into the application:

```
Email: john.doe@example.com
Password: password123
```

---

## 📝 How to Use the Application

### 1. Login
1. Open your browser and go to: http://localhost:5173
2. You'll see the login page
3. Enter the test credentials above
4. Click "Login"

### 2. Browse Products
- After login, you'll be redirected to the Products page
- View all 8 available products including:
  - iPhone 15 Pro ($999.99)
  - MacBook Pro 16" ($2,499.99)
  - Nike Air Max 90 ($119.99)
  - Samsung Galaxy S24 Ultra ($1,199.99)
  - And more!

### 3. View Product Details
- Click on any product card to see full details
- View description, specifications, price, and stock
- Select quantity and add to cart

### 4. Shopping Cart
- Click "Cart" in the navigation bar
- View all items in your cart
- Update quantities with +/- buttons
- Remove items
- See total price calculation
- Note: Cart requires login

### 5. Logout
- Click "Logout" button in the navigation bar
- You'll be redirected to the products page

---

## 🛠 Development Commands

### Backend (from `/backend` directory)
```bash
npm start          # Start server
npm run dev        # Start with auto-reload
```

### Frontend (from `/frontend` directory)
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🔍 API Testing

You can also test the API directly using curl:

### Health Check
```bash
curl http://localhost:3000/health
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Get Cart (requires token)
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure

```
react-technical-assess/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── routes/         # API routes
│   │   ├── config/         # Database config
│   │   └── data/           # Mock data
│   ├── .env               # Environment variables
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # State management
│   │   ├── services/      # API calls
│   │   └── styles/        # CSS styles
│   └── package.json
│
└── .gitignore
```

---

## ✅ Features Implemented

### Core Features
- ✅ User Authentication (Login/Logout)
- ✅ JWT Token Management
- ✅ Protected Routes
- ✅ Product Listing
- ✅ Product Details
- ✅ Shopping Cart (Add/Update/Remove)
- ✅ Loading & Error States
- ✅ Responsive Design

### Additional Features
- ✅ Cart Count Badge
- ✅ Local Storage Persistence
- ✅ Backend Cart Synchronization
- ✅ Auto-redirect on Token Expiration
- ✅ User-friendly Error Messages

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm start
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Can't login
- Make sure backend is running on port 3000
- Check browser console for errors
- Verify credentials: john.doe@example.com / password123

### Cart not working
- Make sure you're logged in
- Cart functionality requires authentication
- Check that backend is running

---

## 📚 API Documentation

Full API documentation is available in:
- `/backend/README.md` - Backend API details
- `/frontend/README.md` - Frontend documentation

---

## 🎯 Next Steps

You can now:
1. Browse and test the application at http://localhost:5173
2. Add items to cart and manage your shopping
3. Test different user roles (buyer, seller, admin)
4. Explore the codebase and make modifications
5. Create a pull request with any enhancements

---

## 💡 Tips

- Cart is persisted in localStorage
- Refresh the page and cart items remain
- Login state is maintained across page reloads
- Mock data is reset when backend restarts
- All passwords in mock data are: `password123`

---

## 🔗 Available Test Users

All users have password: `password123`

1. **john.doe@example.com** (Buyer)
2. **jane.smith@example.com** (Seller)
3. **bob.wilson@example.com** (Buyer)
4. **alice.johnson@example.com** (Admin)
5. **charlie.brown@example.com** (Seller)

---

**Happy Shopping! 🛍️**
