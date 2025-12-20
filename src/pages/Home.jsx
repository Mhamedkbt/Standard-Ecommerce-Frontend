import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productsApi.js';
import { getCategories } from '../api/categoriesApi.js';
import ProductCard from "../components/ProductCard.jsx";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'; 
import Footer from '../components/Footer.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// =========================================================================
// 🌟 SUB-COMPONENTS
// =========================================================================

const CategoryTile = ({ category }) => {
    const url = `/shop?categoryId=${category.id}`;
    // Use the image string directly from Cloudinary
    const imageSrc = typeof category.image === 'string' ? category.image : category.image?.path;

    return (
        <Link
            to={url}
            className="group block relative overflow-hidden h-64 bg-gray-900 rounded-xl shadow-xl border border-gray-700 transition transform duration-300 hover:shadow-2xl hover:border-indigo-500 hover:scale-[1.03]"
        >
            {imageSrc ? (
                <LazyLoadImage
                    src={imageSrc} 
                    alt={category.name}
                    effect="blur"
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-70"
                />
            ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-lg font-semibold">{category.name}</span>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wide group-hover:text-indigo-400 transition-colors">
                    {category.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1 flex items-center">
                    Explore Now 
                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </p>
            </div>
        </Link>
    );
};

const WhyChooseUs = () => {
    return (
        <section className="container mx-auto px-4 md:px-8 my-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 text-center">Why Shop With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition">
                    <i className="fa-solid fa-truck-fast text-4xl text-indigo-600 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
                    <p className="text-gray-600">Quick shipping with reliable tracking for all orders.</p>
                </div>
                <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition">
                    <i className="fa-solid fa-shield-halved text-4xl text-indigo-600 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2">Trusted Quality</h3>
                    <p className="text-gray-600">Premium products, certified and curated with care.</p>
                </div>
                <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition">
                    <i className="fa-solid fa-lock text-4xl text-indigo-600 mb-4"></i>
                    <h3 className="font-bold text-xl mb-2">Secure Checkout</h3>
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

    useEffect(() => {
        async function loadData() {
            try {
                // ⚡️ SPEED FIX: Fetch both together to avoid "Waterfall" delay
                const [productResponse, categoryResponse] = await Promise.all([
                    getProducts(), 
                    getCategories()
                ]);

                // We assume Cloudinary URLs are already correct in the database
                setProducts(productResponse.data.filter(p => p.isAvailable).slice(0, 8));
                setCategories(categoryResponse.data);

            } catch (err) {
                console.error("Failed to fetch home data:", err);
                setError("Connection Error: Could not reach the server.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-700 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Real-time Inventory...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-center bg-white p-10 rounded-xl shadow-2xl">
                    <h1 className="text-3xl font-semibold text-red-700 mb-4">Offline Mode</h1>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar /> 
            
            <main className="container mx-auto px-4 md:px-8 py-10">

                {/* 🚀 HERO SECTION */}
                <section className="relative w-full overflow-hidden rounded-3xl min-h-[500px] shadow-2xl mb-16 bg-gray-900">
                    <img
                        src="https://images.pexels.com/photos/7679685/pexels-photo-7679685.jpeg"
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        loading="eager" 
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8 md:p-16 pt-32">
                        <p className="text-indigo-300 uppercase tracking-widest text-sm mb-3">Experience Elevated Shopping</p>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 max-w-4xl">Discover Finest Quality Products</h1>
                        <Link to="/shop" className="bg-indigo-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:bg-indigo-600 transition transform hover:scale-105">
                            Shop All Collections
                        </Link>
                    </div>
                </section>
                
                {/* 🌟 CATEGORY SHOWCASE */}
                {categories.length > 0 && (
                    <section className="py-10 mb-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Curated Collections</h2>
                            <p className="text-lg text-gray-600">Explore our premium selection.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                            {categories.slice(0, 4).map(c => <CategoryTile key={c.id} category={c} />)}
                        </div>
                    </section>
                )}

                {/* 🛍 FEATURED PRODUCTS */}
                <section className="py-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 text-center">Featured Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} isPublic={true} />
                        ))}
                    </div>
                    {products.length > 0 && (
                        <div className="text-center mt-12">
                            <Link to="/shop" className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 shadow-xl">
                                See All Products
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