import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    setAdding(true);

    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card" onClick={onClick}>
      <img
        src={product.imageUrl || 'https://via.placeholder.com/280x200'}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <p className="product-price">
          ${product.price?.toFixed(2)}
        </p>

        <p className="product-stock">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <button
          onClick={handleAddToCart}
          className="btn btn-primary"
          disabled={adding || product.stock === 0}
          style={{ width: '100%' }}
        >
          {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
