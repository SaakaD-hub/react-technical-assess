import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedMessage, setAddedMessage] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productsAPI.getById(id);

      if (response.success && response.data) {
        setProduct(response.data.product);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    setAddedMessage('');

    try {
      const result = await addToCart(product, quantity);

      if (result.success) {
        setAddedMessage('Added to cart successfully!');
        setTimeout(() => setAddedMessage(''), 3000);
      } else {
        setAddedMessage('Failed to add to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setAddedMessage('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="error">
          <p>{error || 'Product not found'}</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-detail">
        <Link to="/products" className="back-button">
          ← Back to Products
        </Link>

        <div className="product-detail-grid">
          <div>
            <img
              src={product.imageUrl || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="product-detail-image"
            />
          </div>

          <div className="product-detail-info">
            <h1>{product.name}</h1>

            <div className="product-detail-price">
              ${product.price?.toFixed(2)}
            </div>

            <p className="product-detail-description">
              {product.description}
            </p>

            <div className="product-meta">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>Stock:</strong> {product.stock} units available</p>
              {product.category && (
                <p><strong>Category:</strong> {product.category.name}</p>
              )}
              {product.seller && (
                <p><strong>Seller:</strong> {product.seller.firstName} {product.seller.lastName}</p>
              )}
            </div>

            {addedMessage && (
              <div className={`alert ${addedMessage.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {addedMessage}
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <div className="form-group">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  style={{ width: '100px' }}
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                disabled={addingToCart || product.stock === 0}
                style={{ marginTop: '1rem' }}
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
