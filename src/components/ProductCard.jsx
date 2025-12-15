import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useCart } from '../context/CartContext';

const DEFAULT_IMAGE = '/placeholder.jpg';

const ProductCard = ({ product, isPublic }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault(); // Stops link from opening

    if (!product.isAvailable) {
      return alert("This product is currently unavailable.");
    }

    addItem(product, 1, () => {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  };

  const primaryImage = product.images?.[0];
  const imageUrl = primaryImage?.url || DEFAULT_IMAGE;
  const linkUrl = isPublic ? `/product/${product.id}` : `/admin/product/edit/${product.id}`;

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition duration-300 hover:shadow-xl hover:scale-[1.01]">

      {/* Added Toast */}
      {added && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2  bg-green-500 text-white py-0.5 px-3 rounded-full text-xs font-medium z-50 animate-bounce">
          Added to Cart!
        </div>
      )}

      <Link to={linkUrl} className="block">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">

          {/* Product Image */}
          <LazyLoadImage
            src={imageUrl}
            alt={product.name}
            effect="blur"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = DEFAULT_IMAGE)}
          />

          {/* Promotion Badge */}
          {product.onPromotion && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-medium px-3 py-1 rounded-full shadow-md z-20">
              Promo!
            </span>
          )}

          {/* Unavailable Badge */}
          {!product.isAvailable && ( 
            <span className="absolute top-3 right-3 bg-red-100 text-xs font-semibold text-red-800 px-3 py-1 rounded-full shadow-sm z-20">
              Unavailable
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col justify-between">
        <Link to={linkUrl} className="hover:text-indigo-600 transition">
          <h3
            className="text-base font-semibold text-gray-900 mb-2 leading-snug line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end gap-2 mt-2 pt-1">
          {product.onPromotion && (
            <span className="text-gray-400 line-through font-medium text-sm">
              {product.previousPrice} DH
            </span>
          )}
          <span className="text-xl font-extrabold text-green-600">
            {product.price} DH
          </span>
        </div>

        {product.isAvailable ? (
  <button
    onClick={handleAdd}
    className="mt-4 w-full text-center bg-indigo-500 text-white py-2 rounded-lg font-medium text-sm transition hover:bg-indigo-600 focus:outline-none"
  >
    Add To Cart
  </button>
) : (
  <Link
    to={linkUrl}
    className="mt-4 w-full text-center bg-indigo-500 text-white py-2 rounded-lg font-medium text-sm transition hover:bg-indigo-600 focus:outline-none"
  >
    Read more
  </Link>
)}

      </div>
    </div>
  );
};

export default ProductCard;
