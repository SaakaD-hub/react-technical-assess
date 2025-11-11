import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container cart-page">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Browse our products and add items to your cart
          </p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="page-title">Shopping Cart ({getCartCount()} items)</h1>

      <div className="cart-items">
        {cart.map((item) => {
          const product = item.product || {};
          return (
            <div key={product.id} className="cart-item">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/100'}
                alt={product.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <h3>{product.name}</h3>
                <p className="cart-item-price">${product.price?.toFixed(2)}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Subtotal: ${(product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(product.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span style={{ padding: '0 1rem' }}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(product.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(product.id)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>

        <div style={{ margin: '1rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
        </div>

        <div className="cart-total">
          <span>Total:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>

        <button className="btn btn-primary btn-full" style={{ marginBottom: '0.5rem' }}>
          Proceed to Checkout
        </button>

        <button onClick={handleClearCart} className="btn btn-secondary btn-full">
          Clear Cart
        </button>

        <Link
          to="/products"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '1rem',
            color: '#007bff',
            textDecoration: 'none'
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
