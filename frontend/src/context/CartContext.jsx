import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sync with backend if authenticated
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

  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if product already in cart
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

        // Sync with backend if authenticated
        if (isAuthenticated) {
          try {
            await cartAPI.add(product.id, quantity);
          } catch (error) {
            console.error('Error adding to backend cart:', error);
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      setCart(prev =>
        prev.map(item =>
          item.product?.id === productId
            ? { ...item, quantity }
            : item
        )
      );

      // Sync with backend if authenticated
      if (isAuthenticated) {
        try {
          await cartAPI.update(productId, quantity);
        } catch (error) {
          console.error('Error updating backend cart:', error);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, message: 'Failed to update quantity' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCart(prev => prev.filter(item => item.product?.id !== productId));

      // Sync with backend if authenticated
      if (isAuthenticated) {
        try {
          await cartAPI.remove(productId);
        } catch (error) {
          console.error('Error removing from backend cart:', error);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);

      // Sync with backend if authenticated
      if (isAuthenticated) {
        try {
          await cartAPI.clear();
        } catch (error) {
          console.error('Error clearing backend cart:', error);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

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
