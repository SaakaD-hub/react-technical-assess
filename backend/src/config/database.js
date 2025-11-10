// In-memory database for mockup data
// In production, this would connect to a real database

let users = [];
let products = [];
let categories = [];
let orders = [];
let reviews = [];
let cart = [];

// Initialize with mock data
const initializeDatabase = () => {
  // Data will be populated from mock data files
  return {
    users,
    products,
    categories,
    orders,
    reviews,
    cart
  };
};

// Database operations
const db = {
  // Users
  getUsers: () => users,
  getUserById: (id) => users.find(u => u.id === id),
  getUserByEmail: (email) => users.find(u => u.email === email),
  createUser: (user) => {
    users.push(user);
    return user;
  },
  updateUser: (id, updates) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },
  deleteUser: (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
    return null;
  },

  // Products
  getProducts: () => products,
  getProductById: (id) => products.find(p => p.id === id),
  getProductsByCategory: (categoryId) => products.filter(p => p.categoryId === categoryId),
  getProductsBySeller: (sellerId) => products.filter(p => p.sellerId === sellerId),
  createProduct: (product) => {
    products.push(product);
    return product;
  },
  updateProduct: (id, updates) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      return products[index];
    }
    return null;
  },
  deleteProduct: (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      return products.splice(index, 1)[0];
    }
    return null;
  },

  // Categories
  getCategories: () => categories,
  getCategoryById: (id) => categories.find(c => c.id === id),
  createCategory: (category) => {
    categories.push(category);
    return category;
  },
  updateCategory: (id, updates) => {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      return categories[index];
    }
    return null;
  },
  deleteCategory: (id) => {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      return categories.splice(index, 1)[0];
    }
    return null;
  },

  // Orders
  getOrders: () => orders,
  getOrderById: (id) => orders.find(o => o.id === id),
  getOrdersByUser: (userId) => orders.filter(o => o.userId === userId),
  createOrder: (order) => {
    orders.push(order);
    return order;
  },
  updateOrder: (id, updates) => {
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      return orders[index];
    }
    return null;
  },

  // Reviews
  getReviews: () => reviews,
  getReviewById: (id) => reviews.find(r => r.id === id),
  getReviewsByProduct: (productId) => reviews.filter(r => r.productId === productId),
  getReviewsByUser: (userId) => reviews.filter(r => r.userId === userId),
  createReview: (review) => {
    reviews.push(review);
    return review;
  },
  updateReview: (id, updates) => {
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...updates };
      return reviews[index];
    }
    return null;
  },
  deleteReview: (id) => {
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      return reviews.splice(index, 1)[0];
    }
    return null;
  },

  // Cart
  getCartByUser: (userId) => cart.filter(c => c.userId === userId),
  addToCart: (item) => {
    const existing = cart.find(c => c.userId === item.userId && c.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity || 1;
      return existing;
    }
    cart.push(item);
    return item;
  },
  updateCartItem: (userId, productId, quantity) => {
    const item = cart.find(c => c.userId === userId && c.productId === productId);
    if (item) {
      item.quantity = quantity;
      return item;
    }
    return null;
  },
  removeFromCart: (userId, productId) => {
    const index = cart.findIndex(c => c.userId === userId && c.productId === productId);
    if (index !== -1) {
      return cart.splice(index, 1)[0];
    }
    return null;
  },
  clearCart: (userId) => {
    cart = cart.filter(c => c.userId !== userId);
    return true;
  }
};

// Initialize database
initializeDatabase();

export default db;

