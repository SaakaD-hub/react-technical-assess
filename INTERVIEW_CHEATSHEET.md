# Interview Cheatsheet - Quick Reference

## 30-Second Elevator Pitch

"I built a full-stack e-commerce marketplace using React for the frontend and Node.js/Express for the backend. It features JWT authentication, role-based authorization, shopping cart functionality, and product management. The frontend uses React Context for state management, and the backend follows a layered architecture with controllers, middleware, and a database abstraction layer. It's designed to be scalable, secure, and maintainable."

---

## Key Technologies

**Backend:**
- Node.js + Express.js (REST API)
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests
- In-memory database (arrays - simulates real DB)

**Frontend:**
- React 18 (functional components)
- React Router for navigation
- Context API for state management
- Axios for HTTP requests
- Vite for build tooling

---

## Project Structure - One Glance

```
backend/src/
├── server.js          ← Entry point, Express setup
├── config/
│   └── database.js    ← In-memory DB (CRUD operations)
├── controllers/       ← Business logic
├── middleware/        ← Auth, error handling
├── routes/            ← API endpoints
└── data/
    └── mockData.js    ← Sample data

frontend/src/
├── main.jsx           ← Entry point
├── App.jsx            ← Router + Providers
├── components/        ← Reusable UI
├── pages/             ← Route components
├── context/           ← AuthContext, CartContext
└── services/
    └── api.js         ← Axios instance, API calls
```

---

## Top 10 Interview Questions & Answers

### 1. "Explain your application's architecture"

**Answer:** "I used a client-server architecture. The React frontend runs on port 5173, communicating with the Express backend on port 3000 via RESTful APIs. The backend follows MVC-inspired layering: Routes define endpoints, Middleware handles cross-cutting concerns like authentication, Controllers contain business logic, and a Database layer abstracts data access. The frontend uses React Router for navigation and Context API for global state management."

**Show:** `ARCHITECTURE_DIAGRAM.md` (System Architecture Overview section)

---

### 2. "How does authentication work?"

**Answer:** "I implemented JWT-based authentication. When a user logs in, the backend verifies credentials, hashes the password with bcrypt, and generates a JWT token signed with a secret. This token is sent to the frontend, stored in localStorage, and included in the Authorization header of subsequent requests. A middleware on the backend verifies the token and attaches user info to the request object."

**Show:**
- Backend: `backend/src/controllers/authController.js:60-102` (login function)
- Middleware: `backend/src/middleware/auth.js:3-23`
- Frontend: `frontend/src/context/AuthContext.jsx:27-46`

**Code Sample:**
```javascript
// Backend generates token
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Frontend stores token
localStorage.setItem('token', token);

// Axios adds token to requests
config.headers.Authorization = `Bearer ${token}`;

// Middleware verifies token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```

---

### 3. "How do you manage state in React?"

**Answer:** "I use a hybrid approach. Global state like authentication and cart is managed with Context API, which provides data to all components without prop drilling. Local state like form inputs and UI toggles uses useState. Server data from APIs is fetched in useEffect hooks. The cart also persists to localStorage for offline support."

**Show:**
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/context/CartContext.jsx`

**Code Sample:**
```javascript
// Context provides global state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = async (product, quantity) => {
    setCart(prev => [...prev, { product, quantity }]);
    if (isAuthenticated) {
      await cartAPI.add(product.id, quantity);
    }
  };

  return <CartContext.Provider value={{cart, addToCart}}>
    {children}
  </CartContext.Provider>;
};

// Components consume it
const { cart, addToCart } = useCart();
```

---

### 4. "Walk me through adding a product to the cart"

**Answer:** "When the user clicks 'Add to Cart', the ProductCard component calls addToCart from CartContext. The context immediately updates local state (optimistic update) for instant UI feedback. If the user is authenticated, it makes an API call to the backend. The backend's authenticate middleware verifies the JWT, the controller validates the product exists and adds it to the database, then returns success. The frontend confirms the update."

**Show:** `ARCHITECTURE_DIAGRAM.md` (Request/Response Flow section)

**Timeline:**
1. User clicks button (0ms)
2. Context updates state (5ms)
3. UI re-renders (10ms)
4. API request sent (50ms)
5. Backend processes (150ms)
6. Response received (200ms)
7. Confirmation (210ms)

---

### 5. "How do you handle errors?"

**Answer:** "I use centralized error handling. On the backend, all controllers use try-catch blocks and pass errors to the error middleware via next(error). The middleware formats errors consistently with proper status codes. On the frontend, axios interceptors catch response errors globally - for example, 401 errors automatically redirect to login. Individual API calls also have try-catch for specific error handling."

**Show:** `backend/src/middleware/errorHandler.js`

**Code Sample:**
```javascript
// Backend controller
export const getProducts = (req, res, next) => {
  try {
    // logic
  } catch (error) {
    next(error); // Passes to error middleware
  }
};

// Error middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Frontend interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### 6. "What are the main API endpoints?"

**Answer:** "The API is organized into six main resources:
- `/api/auth` - register, login, profile management
- `/api/products` - CRUD operations with filtering, search, and pagination
- `/api/cart` - add, update, remove cart items (protected)
- `/api/orders` - create and view orders (protected)
- `/api/categories` - list product categories
- `/api/reviews` - create and manage product reviews

Most endpoints return JSON with a consistent format: { success, message, data }"

**Show:** `backend/src/server.js:59-65`

---

### 7. "How do you secure the application?"

**Answer:** "Security is implemented in layers:
1. Password hashing with bcrypt (never store plain text)
2. JWT tokens for stateless authentication
3. CORS to restrict cross-origin requests
4. Middleware for authentication and role-based authorization
5. Input validation to prevent injection attacks
6. HTTPS in production
7. Environment variables for secrets (never committed to git)
8. React automatically escapes output to prevent XSS"

**Code Sample:**
```javascript
// Password hashing
const hashedPassword = await bcrypt.hash(password, 10);

// JWT generation
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// Protected route
router.post('/products', authenticate, authorize('seller'), createProduct);

// CORS configuration
app.use(cors({ origin: 'https://yourdomain.com' }));
```

---

### 8. "Why Context API instead of Redux?"

**Answer:** "I chose Context API because it's built into React, has less boilerplate, and is sufficient for this application's complexity. We only have two global states (auth and cart) with straightforward logic. Redux would be more appropriate for very complex state with lots of async operations, middleware requirements like sagas, or if time-travel debugging was needed. For this scale, Context API keeps the codebase simpler and more maintainable."

**When I'd use Redux:**
- 50+ components sharing state
- Complex state transformations
- Need for middleware (thunks, sagas)
- Time-travel debugging required

---

### 9. "How would you deploy this to production?"

**Answer:** "I have three deployment strategies:

**Option 1 (Simplest):** Heroku - Single command deployment, automatic HTTPS, easy scaling. Good for MVPs.

**Option 2 (Professional):** AWS EC2 with Nginx as reverse proxy, PM2 for process management, Let's Encrypt for SSL. Full control, cost-effective.

**Option 3 (Modern):** Split deployment - Vercel for frontend (automatic CDN, edge functions), Render for backend API (auto-scaling, managed). Best developer experience.

In all cases, I'd:
- Use environment variables for configuration
- Enable HTTPS
- Set up monitoring and logging
- Implement CI/CD with GitHub Actions
- Use a real database (MongoDB or PostgreSQL)"

**Show:** `DEPLOYMENT_CHECKLIST.md`

---

### 10. "What would you improve given more time?"

**Answer:** "Several areas:

**Critical:**
- Replace in-memory DB with MongoDB or PostgreSQL
- Add comprehensive test suite (Jest, React Testing Library)
- Implement proper logging (Winston, Morgan)

**Features:**
- Real-time notifications with WebSockets
- Image upload to S3
- Payment integration (Stripe)
- Email notifications (SendGrid)
- Advanced search (Elasticsearch)

**Performance:**
- Redis caching for frequently accessed data
- Database query optimization with indexes
- Image optimization and CDN
- Code splitting and lazy loading

**UX:**
- Loading skeletons
- Better error messages
- Accessibility improvements (WCAG)
- Mobile app (React Native)"

---

## Quick Code References

### Show Authentication Flow
1. Open `backend/src/controllers/authController.js:60-102`
2. Then `frontend/src/context/AuthContext.jsx:27-46`
3. Then `backend/src/middleware/auth.js:3-23`

### Show State Management
1. Open `frontend/src/context/CartContext.jsx`
2. Explain providers in `frontend/src/App.jsx:14-15`
3. Show usage in any component with `useCart()` hook

### Show API Service Pattern
1. Open `frontend/src/services/api.js`
2. Point out interceptors at lines 14-25 and 28-39
3. Show API methods at lines 42-177

### Show Middleware Chain
1. Open `backend/src/middleware/auth.js`
2. Show usage in `backend/src/routes/productRoutes.js`

### Show Controller Logic
1. Open `backend/src/controllers/productController.js:3-71`
2. Explain filtering, sorting, pagination

---

## Technical Terms to Know

**REST API** - Representational State Transfer - architectural style using HTTP methods (GET, POST, PUT, DELETE)

**JWT** - JSON Web Token - secure, stateless authentication token

**Middleware** - Functions that run between receiving a request and sending a response

**CORS** - Cross-Origin Resource Sharing - security feature that restricts cross-origin HTTP requests

**Context API** - React feature for managing global state without prop drilling

**Hooks** - Functions like useState, useEffect that let you use React features in functional components

**CRUD** - Create, Read, Update, Delete - basic database operations

**Bcrypt** - Algorithm for hashing passwords securely

**MVC** - Model-View-Controller - design pattern separating concerns

**SPA** - Single Page Application - web app that loads once and updates dynamically

---

## Common Follow-up Questions

**Q: "How do you handle pagination?"**
A: "The backend accepts page and limit query parameters, calculates offset, slices the array, and returns metadata including total pages. Frontend can implement 'Load More' or numbered pagination."

**Q: "What about scalability?"**
A: "Current architecture supports horizontal scaling. I'd add a load balancer, use a shared database, implement Redis for sessions, and use a message queue for async tasks."

**Q: "How do you prevent SQL injection?"**
A: "Currently using in-memory arrays, but with a real DB I'd use parameterized queries or an ORM like Mongoose/Sequelize which automatically sanitizes inputs."

**Q: "What testing would you add?"**
A: "Unit tests for controllers and utilities, integration tests for API endpoints, component tests for React components, and E2E tests with Cypress for critical user flows."

**Q: "How do you handle file uploads?"**
A: "I'd use multer middleware to handle multipart/form-data, validate file types and sizes, upload to S3, and store the URL in the database."

---

## Body Language & Presentation Tips

1. **Start broad, then dive deep** - Give overview first, then details
2. **Use the code** - Don't just talk, show actual files
3. **Draw diagrams** - If whiteboard available, sketch the flow
4. **Admit unknowns** - "I haven't implemented that, but I'd research [technology]"
5. **Show enthusiasm** - "I really enjoyed solving [problem]"
6. **Ask questions** - About their stack, challenges, team

---

## Last-Minute Checklist

Before interview:
- [ ] App runs locally without errors
- [ ] Can login with test credentials
- [ ] Read all 4 guide documents
- [ ] Practice explaining auth flow out loud
- [ ] Practice explaining state management
- [ ] Know your deployment options
- [ ] Prepared 3 questions for interviewer

During interview:
- [ ] Listen carefully to questions
- [ ] Ask for clarification if needed
- [ ] Structure your answer (overview → details)
- [ ] Reference specific code files
- [ ] Discuss trade-offs you considered
- [ ] Be honest about limitations
- [ ] Show excitement about learning

---

## The Power Words

Use these to show expertise:
- "Separation of concerns"
- "Stateless authentication"
- "Optimistic updates"
- "Middleware chain"
- "Context API for state management"
- "Layered architecture"
- "RESTful API design"
- "JWT-based authentication"
- "Role-based access control"
- "Centralized error handling"

---

## Test Credentials (Have These Ready)

```
Buyer:
Email: john@example.com
Password: password123

Seller:
Email: jane@example.com
Password: password123

Admin:
Email: admin@example.com
Password: password123
```

---

## Ports & URLs

```
Backend:  http://localhost:3000
Frontend: http://localhost:5173
Health:   http://localhost:3000/health
API Base: http://localhost:3000/api
```

---

## If They Ask You to Code

**"Add a like/favorite feature"**
1. Add favorites array to user model
2. Create POST /api/products/:id/favorite endpoint
3. Add authenticate middleware
4. Create controller to toggle favorite
5. Update product to show favorite status
6. Add button in ProductCard component
7. Use optimistic update in Context

**"Add product ratings"**
1. Already have reviews! Show getReviewsByProduct
2. Calculate average in controller
3. Update product.rating field
4. Display stars in ProductCard

---

## Your Unique Selling Points

1. **Clean Architecture** - Proper separation of concerns
2. **Security-First** - JWT, bcrypt, validation, CORS
3. **User Experience** - Optimistic updates, persistent cart
4. **Scalability** - Layered design, stateless auth
5. **Maintainability** - Consistent patterns, error handling
6. **Modern Stack** - React 18, Express, functional components

---

## Closing Statement

"I'm really excited about this opportunity. I built this application to demonstrate my full-stack capabilities, and I'm eager to bring these skills to your team. I'm particularly interested in [mention something from job description]. Do you have any concerns about my qualifications that I can address?"

---

## Emergency: If You Forget Something

**"How does [X] work?"**
→ "Let me open the code and walk you through it" (Buy yourself time)

**Can't remember exact line:**
→ "The implementation is in the [controller/context/service], let me navigate there"

**Don't know something:**
→ "That's a great question. I haven't implemented that yet, but based on my experience, I would approach it by [think through it logically]"

---

## Final Confidence Boosters

✅ You built a full-stack application from scratch
✅ You implemented authentication and authorization
✅ You used modern React patterns (Hooks, Context)
✅ You followed best practices (error handling, validation)
✅ You can explain your decisions
✅ You're prepared and professional

**You've got this!** 🚀

---

Now go review:
1. **QUICK_START.md** - Make sure app runs
2. **INTERVIEW_GUIDE.md** - Deep dive into concepts
3. **ARCHITECTURE_DIAGRAM.md** - Visualize the flow
4. **DEPLOYMENT_CHECKLIST.md** - Know your options

Good luck tomorrow! 💪
