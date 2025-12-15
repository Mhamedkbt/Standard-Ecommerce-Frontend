import React, { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api/productsApi.js';
import { getCategories } from '../api/categoriesApi.js';
import ProductCard from "../components/ProductCard.jsx"; // Assuming ProductCard is correctly implemented
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'; 
import Footer from '../components/Footer.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import API_URL from "../config/api";


// =========================================================================
// 🎯 CRITICAL CONFIGURATION & UTILITIES
// =========================================================================

// Base URL MUST match your backend server
const BACKEND_URL = API_URL;

/**
 * Utility function to convert a relative path (string) to a full URL (string).
 */
const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    // Normalize path separators for URL
    let normalizedPath = path.replace(/\\/g, '/');

    // Ensure there is only one slash between URL and path
    if (normalizedPath.startsWith('/')) {
        return `${BACKEND_URL}${normalizedPath}`;
    }
    return `${BACKEND_URL}/${normalizedPath}`;
};

// Utility function to convert API values (e.g., boolean, 0/1) to strict boolean
const parseBoolean = (value) => {
    if (value === false || value === 0 || String(value).toLowerCase() === "false" || value === null || value === undefined) {
        return false;
    }
    return true;
};


// =========================================================================
// 🌟 SUB-COMPONENTS
// =========================================================================

/**
 * Category Tile Component for the Category Showcase section.
 */
const CategoryTile = ({ category }) => {
    // Generates a URL-friendly slug for linking
    const url = `/shop?categoryId=${category.id}`;
    return (
        <Link
            to={url}
            className="group block relative overflow-hidden h-64 bg-gray-900 rounded-xl shadow-xl border border-gray-700 transition transform duration-300 hover:shadow-2xl hover:border-indigo-500 hover:scale-[1.03]"
        >
            {/* Image Container - Using standard LazyLoadImage for the Categories */}
            {category.imageUrl ? (
                <LazyLoadImage
                    src={category.imageUrl} 
                    alt={`View products in the ${category.name} category`}
                    effect="blur" // Nice loading effect
                    height="100%"
                    width="100%"
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-70"
                />
            ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-lg font-semibold">{category.name}</span>
                </div>
            )}

            {/* Gradient/Dark Overlay (Always present for contrast) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300"></div>

            {/* Text Overlay (Bottom aligned, high contrast) */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-2xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-indigo-400 uppercase">
                    {category.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1 flex items-center">
                    Explore Now 
                    <svg className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </p>
            </div>
        </Link>
    );
};

/**
 * Why Choose Us Section for key features.
 */
const WhyChooseUs = () => {
    return (
        <section className="container mx-auto px-4 md:px-8 my-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 tracking-tight text-center">
                Why Shop With Us?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                
                <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <i className="fa-solid fa-truck-fast text-4xl text-indigo-600 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Fast Delivery</h3>
                    <p className="text-gray-600">Quick shipping with reliable tracking for all orders.</p>
                </div>

                <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <i className="fa-solid fa-shield-halved text-4xl text-indigo-600 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Trusted Quality</h3>
                    <p className="text-gray-600">Premium products, certified and curated with care.</p>
                </div>

                <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <i className="fa-solid fa-lock text-4xl text-indigo-600 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Secure Checkout</h3>
                    <p className="text-gray-600">All payments are encrypted and your data is protected.</p>
                </div>

            </div>
        </section>
    );
};


// =========================================================================
// --- Main Home Component ---
// =========================================================================

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Data processing function for products. 
     * Maps API data structure (path/blurHash) to the structure expected by ProductCard's image component.
     */
    const processProductData = useCallback((product) => {
        
        const normalizeImageObject = (imageObject) => {
            // imageObject might be { path: string, blurHash: string } or just a path string
            const imagePath = imageObject?.path || imageObject; 
            
            if (!imagePath) return null;
            
            return {
                url: getFullImageUrl(imagePath),
                // Pass blurHash if available
                blurHash: imageObject?.blurHash || null, 
            };
        };

        return {
            ...product,
            // Process the list of images
            images: (product.images || [])
                .map(normalizeImageObject) 
                .filter(img => img && img.url), // Filter out images with no URL
            isAvailable: parseBoolean(product.isAvailable),
            onPromotion: parseBoolean(product.onPromotion),
        };
    }, []);

    /**
     * Data processing function for categories.
     * Maps API data structure to a format usable by CategoryTile.
     */
    const processCategoryData = useCallback((category) => {
        // category.image might be an object { path: string, ... } or just a string path
        const imagePath = category.image?.path || category.image; 
        
        return {
            ...category,
            imageUrl: getFullImageUrl(imagePath),
        };
    }, []);

    /**
     * Main data fetching effect.
     */
    useEffect(() => {
        async function loadData() {
            try {
                const [productResponse, categoryResponse] = await Promise.all([
                    getProducts(), 
                    getCategories()
                ]);

                const processedProducts = productResponse.data
                    .map(processProductData)
                    .filter(p => p.isAvailable) // Only show available products
                    .slice(0, 6); // Display max 6 featured products

                const processedCategories = categoryResponse.data.map(processCategoryData);

                setProducts(processedProducts);
                setCategories(processedCategories);
            } catch (err) {
                console.error("Failed to fetch home data:", err);

                let errorMessage = "An unknown error occurred. Please check your network.";
                if (err.response) {
                    if (err.response.status === 403) {
                        errorMessage = "Backend Permissions Issue: Product viewing is blocked by your server security.";
                    } else if (err.response.status >= 500) {
                        errorMessage = "Server Error: The API is currently unreachable or faulty.";
                    }
                } else {
                    errorMessage = `Connection Error: Could not reach the server at ${BACKEND_URL}. Please verify the BACKEND_URL and ensure your server is running.`;
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [processProductData, processCategoryData]);


    // --- Loading State UI ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-700 mb-4 mx-auto"></div>
                    <p className="text-gray-600 font-medium tracking-wide">Loading...</p>
                </div>
            </div>
        );
    }

    // --- Error State UI ---
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-center bg-white p-10 rounded-xl shadow-2xl border border-red-200">
                    <h1 className="text-3xl font-semibold text-red-700 mb-4 tracking-tight">Error Loading Site Data</h1>
                    <p className="text-gray-700 max-w-lg mb-2 font-medium">{error}</p>
                    <p className="text-sm text-gray-500 mt-4">For connection errors, ensure the server is running on the address specified in the `BACKEND_URL` constant within this file.</p>
                </div>
            </div>
        );
    }

    // --- Main Render ---
    return (
        <div className="min-h-screen bg-white">

            <Navbar /> 
            
            <main className="container mx-auto px-4 md:px-8 py-10">

                {/* 🚀 --- 1. HERO SECTION --- 🚀 */}
                <section className="relative w-full overflow-hidden rounded-3xl min-h-[500px] shadow-2xl mb-16">
                    
                    {/* Hero Image: Set to load eagerly for LCP */}
                    <img
                        src="https://images.pexels.com/photos/7679685/pexels-photo-7679685.jpeg"
                        alt="A stylish, high-end product displayed on a wooden surface."
                        fetchPriority="high" 
                        width="1920" 
                        height="1080"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager" 
                    />

                    {/* Dark Overlay for High Contrast */}
                    <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
                    
                    {/* Hero Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8 md:p-16">
                        
                        <p className="text-indigo-300 uppercase tracking-widest text-sm mb-3 font-medium">
                            Experience Elevated Shopping
                        </p>
                        
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl tracking-tight">
                            Discover the Finest Quality Products You Deserve
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl font-light">
                            Hand-curated excellence with secure checkout, backed by a 30-day guarantee.
                        </p>
                        
                        {/* CTA Group */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            
                            {/* Primary CTA */}
                            <Link 
                                to="/shop" 
                                className="inline-flex items-center justify-center bg-indigo-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl transition transform hover:bg-indigo-600 hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                            >
                                Shop All Collections
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            
                            {/* Secondary CTA */}
                            <Link 
                                to="/featured" 
                                className="inline-flex items-center justify-center bg-transparent border-2 border-white/50 text-white font-medium py-4 px-10 rounded-full text-lg transition duration-300 hover:bg-white/20"
                            >
                                View Featured Items
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </div>

                    </div>
                </section>
                
                <hr className="my-16 border-gray-100" />
                
                {/* 🌟 --- 2. Category Showcase --- 🌟 */}
                {categories.length > 0 && (
                    <section id="collections" className="py-10 mb-12">
                        {/* Polished Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                                Curated Collections
                            </h2>
                            <p className="text-lg text-gray-600 max-w-xl mx-auto">
                                Explore our carefully selected product categories and find exactly what you're looking for.
                            </p>
                        </div>
                        
                        {/* Responsive grid for category tiles */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                            {categories.slice(0, 4).map(c => ( // Display max 4 categories prominently
                                <CategoryTile key={c.id} category={c} />
                            ))}
                        </div>
                        
                        {/* "View All" Link */}
                        {categories.length > 4 && (
                            <div className="text-center mt-12">
                                <Link to="/categories" className="inline-flex items-center text-lg text-indigo-700 font-semibold hover:text-indigo-900 transition border-b border-indigo-700 pb-1">
                                    View All Collections
                                    <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        )}
                        {categories.length === 0 && <p className="text-center text-gray-500 mt-8">Collections unavailable at this time.</p>}
                    </section>
                )}


                <hr className="my-16 border-gray-100" />

                {/* 🛍 --- 3. Featured Products Grid --- 🛍 */}
                <section id="featured" className="py-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 tracking-tight text-center">
                        Featured Products
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
                        {/* ProductCard expects the product object with the processed 'images' array */}
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} isPublic={true} />
                        ))}
                    </div>
                    
                    {/* View More Link */}
                    {products.length > 0 && (
                        <div className="text-center mt-12">
                            <Link to="/shop" className="inline-flex items-center text-lg bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full transition hover:bg-indigo-700 shadow-xl">
                                See All Products
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </div>
                    )}
                    
                    {products.length === 0 && <p className="text-center text-gray-500 py-10">No available products found in inventory. Please check your product availability settings.</p>}
                </section>

                <hr className="my-16 border-gray-100" />

                {/* --- 4. Why Choose Us --- */}
                <WhyChooseUs />
                
            </main>

            {/* --- Footer --- */}
            <Footer />
        </div>
    );
}