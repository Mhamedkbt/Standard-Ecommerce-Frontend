import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { getProducts } from "../api/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useCart } from "../context/CartContext";
import API_URL from "../config/api";


// =========================================================================
// CONFIG
// =========================================================================
const BACKEND_URL = API_URL;
const DEFAULT_IMAGE = "/placeholder.jpg";

// =========================================================================
// HELPERS
// =========================================================================
const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const normalizedPath = path.replace(/\\/g, "/");
    return normalizedPath.startsWith("/")
        ? `${BACKEND_URL}${normalizedPath}`
        : `${BACKEND_URL}/${normalizedPath}`;
};

const parseBoolean = (value) => {
    if (
        value === false ||
        value === 0 ||
        String(value).toLowerCase() === "false" ||
        value === null ||
        value === undefined
    ) {
        return false;
    }
    return true;
};

// =========================================================================
// 🌟 SUB-COMPONENTS (OPTIMIZED IMAGE GALLERY)
// =========================================================================

const ProductImageGallery = ({ images, activeImage, setActiveImage, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                <span className="text-gray-400 font-medium">No Images Available</span>
            </div>
        );
    }

    // Smooth transition handler
    const changeImage = (index) => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setActiveImage(images[index].url);
            setIsFading(false);
        }, 200); // Short delay for the fade effect
    };

    const handlePrev = () => {
        const index = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        changeImage(index);
    };

    const handleNext = () => {
        const index = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        changeImage(index);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* 🌟 MAIN DISPLAY */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
                <div className={`w-full h-full transition-all duration-300 ease-in-out ${isFading ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
                    <LazyLoadImage
                        src={activeImage || images[0].url}
                        alt={productName}
                        effect="blur"
                        // 'object-contain' is pro for electronics/shoes, 'object-cover' for clothes. 
                        // Added 'hover:scale-110' for that premium zoom effect.
                        className="w-full h-full object-contain p-6 transition-transform duration-700 hover:scale-110 cursor-zoom-in"
                        onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                    />
                </div>

                {/* PRO Navigation Arrows */}
                {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <button
                            onClick={(e) => { e.preventDefault(); handlePrev(); }}
                            className="pointer-events-auto bg-white/90 backdrop-blur-md hover:bg-black hover:text-white text-gray-800 rounded-full p-3 shadow-xl transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); handleNext(); }}
                            className="pointer-events-auto bg-white/90 backdrop-blur-md hover:bg-black hover:text-white text-gray-800 rounded-full p-3 shadow-xl transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* 🌟 THUMBNAILS LIST */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => changeImage(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                                currentIndex === index
                                    ? "ring-2 ring-indigo-600 ring-offset-2 opacity-100 shadow-md"
                                    : "opacity-60 hover:opacity-100 border border-gray-100"
                            }`}
                        >
                            <img
                                src={img.url}
                                alt="thumbnail"
                                className="w-full h-full object-cover"
                            />
                            {/* Subtle dark overlay on inactive thumbnails */}
                            {currentIndex !== index && <div className="absolute inset-0 bg-gray-900/5 hover:bg-transparent transition-colors" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// =========================================================================
// PAGE
// =========================================================================
export default function ProductPage() {
    const { id } = useParams();
    const location = useLocation();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const processProductData = useCallback((product) => {
        const normalizeImageObject = (imageObject) => {
            const imagePath = imageObject?.path || imageObject;
            if (!imagePath) return null;
            return {
                url: getFullImageUrl(imagePath),
                blurHash: imageObject?.blurHash || null,
            };
        };
        return {
            ...product,
            images: (product.images || []).map(normalizeImageObject).filter((img) => img && img.url),
            isAvailable: parseBoolean(product.isAvailable),
            onPromotion: parseBoolean(product.onPromotion),
        };
    }, []);

    // Fetch products
    useEffect(() => {
        async function loadProductAndRelated() {
            try {
                setLoading(true);
                const response = await getProducts();
                const processedAllProducts = response.data.map(processProductData);
                setAllProducts(processedAllProducts);

                const found = processedAllProducts.find((p) => String(p.id) === String(id));
                if (!found) {
                    setError("Product not found.");
                    return;
                }

                setProduct(found);
                setActiveImage(found.images?.[0]?.url || DEFAULT_IMAGE);
                window.scrollTo(0, 0);
            } catch (err) {
                console.error("Failed to load product data:", err);
                setError("Failed to load product and related items. Check API connection.");
            } finally {
                setLoading(false);
            }
        }

        loadProductAndRelated();
    }, [id, processProductData]);

    const relatedProducts = useMemo(() => {
        if (!product || !product.category || allProducts.length === 0) return [];
        return allProducts
            .filter(p =>
                p.category?.toLowerCase().trim() === product.category?.toLowerCase().trim() &&
                String(p.id) !== String(product.id) &&
                p.isAvailable
            )
            .slice(0, 4);
    }, [product, allProducts]);

    const handleAddToCart = () => {
        if (!product.isAvailable) return;
        addItem(product, quantity, () => {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-8">
                    <div className="bg-white p-10 rounded-2xl shadow-2xl text-center border border-gray-200">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Product Error</h1>
                        <p className="text-gray-700 max-w-md">{error}</p>
                        <Link to="/shop" className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                            Go back to Shop
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 md:px-8 py-8 lg:py-12">
                
                {/* Main Product Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8 lg:p-12">
                        <div className="lg:order-1">
                            <ProductImageGallery
                                images={product.images}
                                activeImage={activeImage}
                                setActiveImage={setActiveImage}
                                productName={product.name}
                            />
                        </div>
                        <div className="lg:order-2 flex flex-col">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                                    {product.category || "Uncategorized"}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3 mb-6">
                                {product.onPromotion && (
                                    <span className="text-gray-500 line-through text-lg">
                                        {product.previousPrice} DH
                                    </span>
                                )}
                                <span className="text-4xl font-bold text-green-700">
                                    {product.price} DH
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.isAvailable ? (
                                    <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>In Stock</span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="mb-8">
                                <div className="flex items-center">
                                    <span className="text-gray-700 font-medium mr-4">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                            disabled={!product.isAvailable}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                                            disabled={!product.isAvailable}
                                        />
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                            disabled={!product.isAvailable}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.isAvailable}
                                    className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                                        product.isAvailable
                                            ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
                                            : "bg-gray-300 cursor-not-allowed"
                                    }`}
                                >
                                    {product.isAvailable ? (
                                        <>
                                            <i className="fa-solid fa-cart-shopping mr-2"></i>
                                            Add to Cart
                                        </>
                                    ) : (
                                        "Out of Stock"
                                    )}
                                </button>
                                {addedToCart && (
                                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center animate-fade-in">
                                        <i className="fa-solid fa-check-circle mr-2"></i>
                                        Added to cart successfully!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* 👇 START OF DESCRIPTION SECTION ADDITION 👇 */}
                    <div className="p-6 md:p-8 lg:p-12 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                            Product Details
                        </h2>
                        {/* FIX APPLIED HERE: Using dir="auto" for mixed language content */}
                        {product.description ? (
                            <p 
                                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                style={{ 
                                    unicodeBidi: 'plaintext',
                                    textAlign: 'start'
                                }}
                                dir="auto"
                            >
                                {product.description}
                            </p>
                        ) : (
                            <p className="text-gray-500 italic">
                                No detailed description is available for this product.
                            </p>
                        )}
                    </div>
                    {/* 👆 END OF DESCRIPTION SECTION ADDITION 👆 */}

                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            You May Also Like
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(relatedProduct => (
                                <ProductCard 
                                    key={relatedProduct.id} 
                                    product={relatedProduct} 
                                    isPublic={true} 
                                />
                            ))}
                        </div>
                        
                        <div className="text-center mt-10">
                            <Link 
                                to={`/shop?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                View All {product.category} Products
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </section>
                )}
                
            </main>

            <Footer />
        </div>
    );
}