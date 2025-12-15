import React, { useEffect, useState, useCallback } from "react";
import { getCategories } from "../api/categoriesApi.js";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import API_URL from "../config/api";

// Backend URL (same as Home)
const BACKEND_URL = API_URL;


const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const normalizedPath = path.replace(/\\/g, "/");
  return normalizedPath.startsWith("/")
    ? `${BACKEND_URL}${normalizedPath}`
    : `${BACKEND_URL}/${normalizedPath}`;
};

/* 🔹 SAME CategoryTile (NO DESIGN CHANGE) */
const CategoryTile = ({ category }) => {
  // FIX: Use categoryId instead of slug
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
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-70"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-gray-400 text-lg font-semibold">
            {category.name}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-2xl font-bold text-white uppercase group-hover:text-indigo-400">
          {category.name}
        </h3>
        <p className="text-sm text-gray-300 mt-1">Explore Now →</p>
      </div>
    </Link>
  );
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const processCategoryData = useCallback((category) => {
    const imagePath = category.image?.path || category.image;
    return {
      ...category,
      imageUrl: getFullImageUrl(imagePath),
    };
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories();
        setCategories(res.data.map(processCategoryData));
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [processCategoryData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-14 w-14 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            All Collections
          </h1>
          <p className="text-gray-600 mt-3">
            Browse all our available categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((c) => (
            <CategoryTile key={c.id} category={c} />
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-center text-gray-500 mt-12">
            No categories available.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
