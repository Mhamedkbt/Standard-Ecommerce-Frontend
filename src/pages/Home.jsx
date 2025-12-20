import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getProducts } from '../api/productsApi.js';
import { getCategories } from '../api/categoriesApi.js';
import ProductCard from "../components/ProductCard.jsx";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'; 
import Footer from '../components/Footer.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import API_URL from "../config/api";

const BACKEND_URL = API_URL;

const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    let normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.startsWith('/') ? `${BACKEND_URL}${normalizedPath}` : `${BACKEND_URL}/${normalizedPath}`;
};

const parseBoolean = (value) => {
    return !(value === false || value === 0 || String(value).toLowerCase() === "false" || value === null || value === undefined);
};

// =========================================================================
// 🌟 SUB-COMPONENTS
// =========================================================================

const CategoryTile = ({ category }) => {
    const url = `/shop?categoryId=${category.id}`;
    return (
        <Link
            to={url}
            className="group block relative overflow-hidden h-64 bg-gray-900 rounded-xl shadow-xl border border-gray-700 transition transform duration-300 hover:shadow-2xl hover:border-indigo-500 hover:scale-[1.03]"
        >
            {category.imageUrl ? (
                <LazyLoadImage
                    src={category.imageUrl} 
                    alt={category.name}
                    effect="blur"
                    height="100%"
                    width="100%"
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-70"
                />
            ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-lg font-semibold">{category.name}</span>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
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
            images: (product.images || []).map(normalizeImageObject).filter(img => img && img.url),
            isAvailable: parseBoolean(product.isAvailable),
            onPromotion: parseBoolean(product.onPromotion),
        };
    }, []);

    const processCategoryData = useCallback((category) => {
        const imagePath = category.image?.path || category.image; 
        return {
            ...category,
            imageUrl: getFullImageUrl(imagePath),
        };
    }, []);

    useEffect(() => {
        // High-priority preload for hero image
        const heroImg = new Image();
        heroImg.src = "https://images.pexels.com/photos/7679685/pexels-photo-7679685.jpeg";

        async function loadData() {
            try {
                const [productResponse, categoryResponse] = await Promise.all([
                    getProducts(), 
                    getCategories()
                ]);

                const processedProducts = productResponse.data
                    .map(processProductData)
                    .filter(p => p.isAvailable)
                    .slice(0, 8);

                const processedCategories = categoryResponse.data.map(processCategoryData);

                setProducts(processedProducts);
                setCategories(processedCategories);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.response?.status === 403 ? "Security Block: Forbidden" : "Connection Error: API Unreachable");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [processProductData, processCategoryData]);

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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-center bg-white p-10 rounded-xl shadow-2xl border border-red-200">
                    <h1 className="text-3xl font-semibold text-red-700 mb-4 tracking-tight">Error Loading Site Data</h1>
                    <p className="text-gray-700 mb-2 font-medium">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar /> 
            <main className="container mx-auto px-4 md:px-8 py-10">
                {/* HERO SECTION - Optimized for Speed */}
                <section className="relative w-full overflow-hidden rounded-3xl min-h-[500px] shadow-2xl mb-16">
                    <img
                        src="https://images.pexels.com/photos/7679685/pexels-photo-7679685.jpeg"
                        alt="High-end product showcase"
                        fetchPriority="high" 
                        width="1920" 
                        height="1080"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager" 
                        decoding="sync"
                    />
                    <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8 md:p-16">
                        <p className="text-indigo-300 uppercase tracking-widest text-sm mb-3 font-medium">Experience Elevated Shopping</p>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl tracking-tight">
                            Discover the Finest Quality Products You Deserve
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl font-light">
                            Hand-curated excellence with secure checkout, backed by a 30-day guarantee.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/shop" className="inline-flex items-center justify-center bg-indigo-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl transition transform hover:bg-indigo-600 hover:scale-[1.05]">
                                Shop All Collections
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <Link to="/featured" className="inline-flex items-center justify-center bg-transparent border-2 border-white/50 text-white font-medium py-4 px-10 rounded-full text-lg transition duration-300 hover:bg-white/20">
                                View Featured Items
                            </Link>
                        </div>
                    </div>
                </section>

                <hr className="my-16 border-gray-100" />
                
                {/* Category Showcase */}
                {categories.length > 0 && (
                    <section id="collections" className="py-10 mb-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Curated Collections</h2>
                            <p className="text-lg text-gray-600 max-w-xl mx-auto">Explore our carefully selected product categories.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                            {categories.slice(0, 4).map(c => <CategoryTile key={c.id} category={c} />)}
                        </div>
                        {categories.length > 4 && (
                            <div className="text-center mt-12">
                                <Link to="/categories" className="inline-flex items-center text-lg text-indigo-700 font-semibold hover:text-indigo-900 transition border-b border-indigo-700 pb-1">
                                    View All Collections
                                    <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        )}
                    </section>
                )}

                <hr className="my-16 border-gray-100" />

                {/* Featured Products */}
                <section id="featured" className="py-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 tracking-tight text-center">Featured Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
                        {products.map(product => <ProductCard key={product.id} product={product} isPublic={true} />)}
                    </div>
                    {products.length > 0 && (
                        <div className="text-center mt-12">
                            <Link to="/shop" className="inline-flex items-center text-lg bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full transition hover:bg-indigo-700 shadow-xl">
                                See All Products
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </div>
                    )}
                </section>

                <hr className="my-16 border-gray-100" />
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
}