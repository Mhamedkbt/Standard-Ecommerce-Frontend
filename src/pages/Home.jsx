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
// ⚡️ UTILITIES (Optimized for Production)
// =========================================================================
const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${API_URL}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

// =========================================================================
// 🌟 PRO SUB-COMPONENTS
// =========================================================================

const CategoryTile = ({ category }) => (
    <Link
        to={`/shop?categoryId=${category.id}`}
        className="group relative block h-80 overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl"
    >
        <LazyLoadImage
            src={getFullImageUrl(category.image?.path || category.image)}
            alt={category.name}
            effect="blur"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{category.name}</h3>
            <p className="text-sm text-indigo-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore Collection →</p>
        </div>
    </Link>
);

const Feature = ({ icon, title, desc }) => (
    <div className="group p-8 rounded-2xl bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all duration-300">
        <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-xl group-hover:scale-110 transition-transform">
            <i className={icon}></i>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

// =========================================================================
// 🏗 MAIN HOME COMPONENT
// =========================================================================

export default function Home() {
    const [data, setData] = useState({ products: [], categories: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ⚡️ Data Processing (Fixes the "Broken Image" issue)
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
                    categories: resCat.data.slice(0, 4)
                });
            } catch (err) {
                setError("Unable to connect to the store. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [transformProduct]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            <Navbar />

            {/* 🚀 PRO HERO SECTION */}
            <section className="relative px-4 pt-6 pb-12 md:px-8">
                <div className="relative h-[600px] md:h-[750px] w-full overflow-hidden rounded-[2rem] bg-gray-900 shadow-3xl">
                    <img 
                        src="https://images.pexels.com/photos/7679685/pexels-photo-7679685.jpeg" 
                        className="absolute inset-0 h-full w-full object-cover object-center opacity-60 transition-scale duration-[10s] hover:scale-110" 
                        alt="Premium Banner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    
                    <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-20 lg:w-2/3">
                        <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">New Season 2025</span>
                        <h1 className="mb-6 text-5xl font-black leading-[1.1] text-white md:text-7xl lg:text-8xl tracking-tighter">
                            QUALITY <br /> WITHOUT <br /> <span className="text-indigo-500">COMPROMISE.</span>
                        </h1>
                        <p className="mb-10 max-w-lg text-lg text-gray-300 md:text-xl font-light leading-relaxed">
                            Experience the intersection of luxury and performance. Hand-curated essentials for the modern lifestyle.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop" className="rounded-full bg-indigo-600 px-10 py-4 text-center text-lg font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                                Shop Collection
                            </Link>
                            <Link to="/featured" className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 text-center text-lg font-bold text-white transition-all hover:bg-white/20">
                                View Lookbook
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 md:px-8">
                
                {/* 🌟 COLLECTIONS */}
                <section className="py-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight text-gray-900 uppercase">The Directory</h2>
                            <p className="text-gray-500 mt-2">Browse our high-end curated categories.</p>
                        </div>
                        <Link to="/categories" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 hover:text-indigo-800 transition-colors">View All Collections</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.categories.map(cat => <CategoryTile key={cat.id} category={cat} />)}
                    </div>
                </section>

                {/* 🛍 FEATURED PRODUCTS */}
                <section className="py-20 border-t border-gray-100">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tight uppercase mb-4">New Arrivals</h2>
                        <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {data.products.map(p => <ProductCard key={p.id} product={p} isPublic={true} />)}
                    </div>
                    <div className="mt-20 text-center">
                        <Link to="/shop" className="inline-block rounded-full border-2 border-gray-900 px-12 py-4 text-lg font-black uppercase transition-all hover:bg-gray-900 hover:text-white">
                            View Full Inventory
                        </Link>
                    </div>
                </section>

                {/* --- WHY US --- */}
                <section className="py-24 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <Feature icon="fa-solid fa-bolt" title="Express Logistics" desc="Domestic orders delivered within 48 hours with premium tracking." />
                        <Feature icon="fa-solid fa-gem" title="Pure Quality" desc="Every item undergoes a 5-point inspection before reaching your door." />
                        <Feature icon="fa-solid fa-fingerprint" title="Secure Privacy" desc="Military-grade encryption for all transactions and user data." />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}