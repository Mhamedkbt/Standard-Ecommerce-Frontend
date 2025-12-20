import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// API & Components
import { getProducts } from '../api/productsApi.js';
import { getCategories } from '../api/categoriesApi.js';
import ProductCard from "../components/ProductCard.jsx";
import Navbar from '../components/Navbar.jsx'; 
import Footer from '../components/Footer.jsx';
import API_URL from "../config/api";

// =========================================================================
// ⚡️ UTILITIES
// =========================================================================
const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${API_URL}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

// =========================================================================
// 🌟 SUB-COMPONENTS
// =========================================================================

const CategoryTile = ({ category }) => (
    <Link
        to={`/shop?categoryId=${category.id}`}
        className="group relative block h-72 overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl"
    >
        <LazyLoadImage
            src={getFullImageUrl(category.image?.path || category.image)}
            alt={category.name}
            effect="blur"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-lg font-semibold text-white tracking-wide uppercase">{category.name}</h3>
            {/* Now always visible as requested */}
            <p className="text-xs text-indigo-300 font-medium mt-1">Explore Collection →</p>
        </div>
    </Link>
);

const Feature = ({ icon, title, desc }) => (
    <div className="p-8 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
        <i className={`${icon} text-3xl text-indigo-600 mb-4 block`}></i>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

// =========================================================================
// 🏗 MAIN HOME COMPONENT
// =========================================================================

export default function Home() {
    const [data, setData] = useState({ products: [], categories: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const transformProduct = useCallback((p) => ({
        ...p,
        images: (p.images || []).map(img => ({
            url: getFullImageUrl(img.path || img),
            blurHash: img.blurHash || null
        })).filter(i => i.url),
        isAvailable: p.isAvailable === true || p.isAvailable === 1 || String(p.isAvailable) === "true"
    }), []);

    useEffect(() => {
        const loadPageData = async () => {
            try {
                const [resProd, resCat] = await Promise.all([getProducts(), getCategories()]);
                setData({
                    products: resProd.data.map(transformProduct).filter(p => p.isAvailable).slice(0, 8),
                    categories: resCat.data
                });
            } catch (err) {
                setError("Connection error. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [transformProduct]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            <Navbar />

            {/* 🚀 REFINED HERO SECTION (Minimalist & Clean) */}
            <section className="container mx-auto px-4 md:px-8 py-10">
                <div className="relative h-[550px] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl">
                    <img 
                        src="https://images.pexels.com/photos/7679685/pexels-photo-7679685.jpeg" 
                        className="absolute inset-0 h-full w-full object-cover opacity-70" 
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-indigo-400">Premium Essentials</p>
                        <h1 className="mb-6 text-4xl md:text-6xl font-light text-white tracking-tight leading-tight max-w-3xl">
                            The New Standard of <span className="font-semibold text-white">Modern Living</span>
                        </h1>
                        <p className="mb-8 max-w-xl text-base text-gray-200 font-light">
                            Discover our curated selection of high-performance products designed for those who value quality above all else.
                        </p>
                        <Link to="/shop" className="rounded-full bg-indigo-600 px-12 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-700 shadow-lg">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 md:px-8">
                
                <hr className="my-16 border-gray-50" />

                {/* 🌟 COLLECTIONS */}
                <section className="py-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Collections</h2>
                        <p className="text-gray-500 mt-2">Explore products by category</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {data.categories.slice(0, 4).map(cat => <CategoryTile key={cat.id} category={cat} />)}
                    </div>

                    {/* View All Collections - Moved to Bottom only */}
                    {data.categories.length > 4 && (
                        <div className="mt-10 text-center">
                            <Link to="/categories" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors border-b border-indigo-200 pb-1">
                                View All Collections →
                            </Link>
                        </div>
                    )}
                </section>

                <hr className="my-16 border-gray-50" />

                {/* 🛍 FEATURED PRODUCTS */}
                <section className="py-10">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12 text-center text-indigo-800">Featured Arrivals</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {data.products.map(p => (
                            <ProductCard key={p.id} product={p} isPublic={true} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/shop" className="inline-block rounded-full bg-gray-900 px-10 py-3 text-sm font-bold text-white transition-all hover:bg-black">
                            Browse All Products
                        </Link>
                    </div>
                </section>

                <hr className="my-16 border-gray-50" />

                {/* --- WHY US --- */}
                <section className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Feature icon="fa-solid fa-truck" title="Fast Shipping" desc="Global logistics ensuring your products arrive safely and on schedule." />
                        <Feature icon="fa-solid fa-check-circle" title="Quality Guaranteed" desc="Every product in our inventory is hand-picked for durability and style." />
                        <Feature icon="fa-solid fa-lock" title="Secure Payment" desc="Your data security is our priority. All transactions are fully encrypted." />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}