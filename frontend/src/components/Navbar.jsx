import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Marketplace
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/products" className="navbar-link">
                Products
              </Link>

              <Link to="/cart" className="navbar-link">
                Cart
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>

              <span className="navbar-link" style={{ cursor: 'default' }}>
                Welcome, {user?.firstName || user?.email}
              </span>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/products" className="navbar-link">
                Products
              </Link>

              <Link to="/login" className="navbar-link">
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
