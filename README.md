# Marketplace Application - Full Stack React + Node.js

A complete e-commerce marketplace built with React and Node.js, featuring authentication, shopping cart, product management, and more.

## 🚀 Quick Start

```bash
# Backend
cd backend
npm install
npm run dev    # Runs on http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev    # Runs on http://localhost:5173
```

**Test Login:**
- Email: `john@example.com`
- Password: `password123`

---

## 📚 Interview Preparation Guides

I've created comprehensive guides to help you understand and explain this application:

### 1. 🎯 [QUICK_START.md](./QUICK_START.md) - START HERE
**5-minute guide to get the app running**
- Installation steps
- How to test features
- Common issues and fixes
- Project structure overview

### 2. 📖 [INTERVIEW_GUIDE.md](./INTERVIEW_GUIDE.md) - MAIN STUDY GUIDE
**Comprehensive 60-page deep dive covering:**
- Complete backend architecture with code samples
- Complete frontend architecture with code samples
- Data flow from backend to frontend
- Authentication & security explained
- Clean code practices used
- Testing strategies
- Common interview questions with answers
- Technical concepts explained for beginners

### 3. 🏗️ [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) - VISUAL LEARNING
**Visual diagrams showing:**
- System architecture
- Authentication flow
- Request/response flow
- Component hierarchy
- Database schema
- Deployment architectures
- Security layers

### 4. 🚀 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - PRODUCTION READY
**Step-by-step deployment guides for:**
- Heroku (easiest)
- AWS EC2 (professional)
- Vercel + Render (modern)
- Security checklist
- Monitoring and troubleshooting

### 5. ⚡ [INTERVIEW_CHEATSHEET.md](./INTERVIEW_CHEATSHEET.md) - LAST MINUTE REVIEW
**Quick reference with:**
- 30-second elevator pitch
- Top 10 interview questions & answers
- Code references to show
- Technical terms glossary
- Test credentials
- Confidence boosters

---

## 🎯 How to Prepare for Your Interview

### Day Before Interview (2-3 hours)
1. **Run the application** (15 mins)
   - Follow QUICK_START.md
   - Test all features
   - Login, browse products, add to cart

2. **Read INTERVIEW_GUIDE.md** (90 mins)
   - Focus on backend architecture section
   - Focus on frontend architecture section
   - Understand the data flow
   - Read code samples

3. **Study ARCHITECTURE_DIAGRAM.md** (30 mins)
   - Visualize how everything connects
   - Understand authentication flow
   - Memorize component hierarchy

4. **Review INTERVIEW_CHEATSHEET.md** (30 mins)
   - Practice answering top 10 questions
   - Memorize elevator pitch
   - Note which files to show for each topic

### Morning of Interview (30 mins)
1. **Re-read INTERVIEW_CHEATSHEET.md**
2. **Start the application** - Make sure it runs
3. **Test login** with provided credentials
4. **Practice explaining** one flow out loud (e.g., authentication)

---

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server and REST API
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **In-memory database** - Arrays (simulates real DB)

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **Vite** - Build tool

---

## 📁 Project Structure

```
react-technical-assess/
│
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── server.js          # Entry point
│   │   ├── config/
│   │   │   └── database.js    # In-memory database
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   ├── routes/            # API endpoints
│   │   └── data/
│   │       └── mockData.js    # Sample data
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── main.jsx           # Entry point
│   │   ├── App.jsx            # Router + Providers
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Route components
│   │   ├── context/           # Global state (Auth, Cart)
│   │   └── services/
│   │       └── api.js         # API calls
│   └── package.json
│
├── README.md                  # This file
├── QUICK_START.md            # 5-minute setup guide
├── INTERVIEW_GUIDE.md        # Comprehensive study guide
├── ARCHITECTURE_DIAGRAM.md   # Visual diagrams
├── DEPLOYMENT_CHECKLIST.md   # Deployment guide
└── INTERVIEW_CHEATSHEET.md   # Quick reference
```

---

## ✨ Features

### Implemented
- ✅ User authentication (register, login, logout)
- ✅ JWT-based authorization
- ✅ Role-based access control (buyer, seller, admin)
- ✅ Product browsing with search and filters
- ✅ Shopping cart (add, update, remove items)
- ✅ Product categories
- ✅ Product reviews and ratings
- ✅ Order management
- ✅ Protected routes
- ✅ Persistent cart (localStorage)
- ✅ Responsive design

### Backend Capabilities
- RESTful API design
- Middleware chain (CORS, auth, error handling)
- Password hashing with bcrypt
- JWT token generation and verification
- Input validation
- Pagination and filtering
- Consistent error responses

### Frontend Capabilities
- React Router for navigation
- Context API for state management
- Axios interceptors for auth
- Protected routes
- Optimistic UI updates
- localStorage persistence

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/profile       # Get profile (protected)
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
GET    /api/cart               # Get cart (protected)
POST   /api/cart               # Add to cart (protected)
PUT    /api/cart/:productId    # Update quantity (protected)
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
PUT    /api/orders/:id/status  # Update status (seller/admin)
```

### Reviews
```
GET    /api/reviews            # Get all reviews
POST   /api/reviews            # Create review (protected)
PUT    /api/reviews/:id        # Update review (protected)
DELETE /api/reviews/:id        # Delete review (protected)
```

---

## 🔐 Test Credentials

```javascript
// Buyer account
Email: john@example.com
Password: password123

// Seller account
Email: jane@example.com
Password: password123

// Admin account
Email: admin@example.com
Password: password123
```

---

## 🎓 Key Concepts Demonstrated

### Backend
- **Layered Architecture** - Separation of routes, controllers, database
- **Middleware Pattern** - Authentication, authorization, error handling
- **JWT Authentication** - Stateless, secure authentication
- **RESTful API Design** - Proper HTTP methods and status codes
- **Error Handling** - Centralized error middleware
- **Security** - Password hashing, CORS, input validation

### Frontend
- **Component Architecture** - Reusable components
- **State Management** - Context API for global state
- **Routing** - React Router with protected routes
- **API Integration** - Axios with interceptors
- **Hooks** - useState, useEffect, useContext, custom hooks
- **Performance** - Optimistic updates, localStorage caching

---

## 🚀 What Makes This Application Interview-Ready

1. **Professional Architecture**
   - Clean separation of concerns
   - Scalable folder structure
   - Consistent patterns

2. **Security Best Practices**
   - JWT authentication
   - Password hashing
   - Protected routes
   - CORS configuration

3. **Modern React Patterns**
   - Functional components
   - Hooks
   - Context API
   - React Router v6

4. **Production Considerations**
   - Environment variables
   - Error handling
   - Input validation
   - Consistent API responses

5. **Maintainability**
   - Clear naming conventions
   - Code organization
   - Reusable components
   - DRY principle

---

## 📈 Possible Improvements (Great for Discussion)

**Database:**
- Migrate to MongoDB or PostgreSQL
- Add database migrations
- Implement proper relationships

**Testing:**
- Unit tests with Jest
- Integration tests for API
- Component tests with React Testing Library
- E2E tests with Cypress

**Features:**
- Image upload (S3)
- Payment integration (Stripe)
- Email notifications
- Real-time updates (WebSockets)
- Admin dashboard
- Order tracking

**Performance:**
- Redis caching
- Database indexing
- Image optimization
- Code splitting
- CDN integration

**DevOps:**
- CI/CD pipeline
- Docker containerization
- Monitoring (Sentry, DataDog)
- Logging (Winston)
- Auto-scaling

---

## 🤝 How to Demo During Interview

### Start with Overview (2 mins)
"This is a full-stack e-commerce marketplace. Let me show you the features..."
- Login → Browse products → Add to cart → View cart

### Show Architecture (3 mins)
Open ARCHITECTURE_DIAGRAM.md and explain:
- Frontend talks to Backend via REST API
- Backend has layered architecture
- Authentication uses JWT

### Deep Dive - Pick One (5 mins)
**Authentication Flow:**
1. Show `authController.js` - login function
2. Show `AuthContext.jsx` - how frontend uses it
3. Show `auth.js` middleware - token verification
4. Explain JWT structure

**Or State Management:**
1. Show `App.jsx` - Context providers
2. Show `CartContext.jsx` - cart logic
3. Show component using `useCart()` hook
4. Explain optimistic updates

### Discuss (5 mins)
- Design decisions
- Trade-offs considered
- What you'd improve
- Questions about their stack

---

## 🎯 Interview Pro Tips

**Do's:**
- ✅ Start with big picture, then dive into details
- ✅ Show actual code, don't just describe
- ✅ Explain your thought process
- ✅ Discuss trade-offs you considered
- ✅ Be honest about what you don't know
- ✅ Ask questions about their architecture

**Don'ts:**
- ❌ Don't apologize for what's not implemented
- ❌ Don't skip the demo
- ❌ Don't use jargon without explaining
- ❌ Don't pretend to know something you don't
- ❌ Don't talk too fast

**If Stuck:**
- "Let me open that file and walk through it"
- "That's a great question. Here's how I'd approach it..."
- "I haven't implemented that, but based on my research I'd use..."

---

## 💡 Your Elevator Pitch

"I built a full-stack marketplace application to demonstrate my React and Node.js skills. The backend is a RESTful API using Express with JWT authentication, role-based authorization, and a layered architecture separating routes, controllers, and data access. The frontend uses React with Context API for state management, React Router for navigation, and Axios for API communication. Key features include user authentication, product browsing with search and filters, a persistent shopping cart, and order management. The architecture is designed to be scalable, secure, and maintainable, following industry best practices like centralized error handling, password hashing, and separation of concerns."

---

## 📞 Support

If something doesn't work:
1. Check QUICK_START.md for common issues
2. Make sure both backend and frontend are running
3. Verify you're using Node.js 16+
4. Check that ports 3000 and 5173 are available

---

## 📝 License

This project is for interview demonstration purposes.

---

## 🎉 You're Ready!

You have everything you need to ace the interview:
1. ✅ A working full-stack application
2. ✅ Comprehensive guides explaining every part
3. ✅ Visual diagrams for quick understanding
4. ✅ Deployment knowledge
5. ✅ Practice questions and answers

**Start with QUICK_START.md, then read INTERVIEW_GUIDE.md!**

Good luck with your interview! 🚀

---

**Questions to Ask Them:**
- What does your current tech stack look like?
- What are the biggest technical challenges your team faces?
- How do you approach code reviews and testing?
- What would my typical day look like?
- What opportunities are there for learning and growth?

---

Remember: You built this. You understand it. You can explain it. **You've got this!** 💪
