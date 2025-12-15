// src/pages/About.jsx
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';


export default function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 md:px-8 py-16 lg:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                            About <span className="font-medium">ECOMM</span>
                        </h1>
                        <div className="w-20 h-1 bg-indigo-200 mx-auto"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
                        <div className="p-8 md:p-12">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                We are dedicated to bringing you the highest quality products with a focus on durability, design, and sustainability. Founded in 2023, ECOMM has quickly become a trusted source for modern essentials.
                            </p>
                        </div>
                    </div>

                    {/* Mission Section */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8 md:p-12">
                            <h2 className="text-2xl font-medium text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-700 leading-relaxed">
                                To simplify your shopping experience by curating collections that blend timeless style with modern functionality. We believe in transparency and ethical sourcing.
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8 md:p-12">
                            <h2 className="text-2xl font-medium text-gray-900 mb-4">Our Vision</h2>
                            <p className="text-gray-700 leading-relaxed">
                                To create a sustainable future by offering products that last a lifetime, reducing waste and promoting conscious consumption.
                            </p>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h2 className="text-2xl font-medium text-gray-900 mb-6">The Team</h2>
                            <p className="text-gray-700 leading-relaxed mb-8">
                                Our small, dedicated team of designers, engineers, and customer service experts works tirelessly to ensure every detail, from product quality to unboxing, is perfect.
                            </p>
                            
                            {/* Team Values */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">Quality First</h3>
                                    <p className="text-sm text-gray-600">We never compromise on quality, ensuring every product meets our high standards.</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">Sustainability</h3>
                                    <p className="text-sm text-gray-600">We're committed to reducing our environmental footprint through sustainable practices.</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">Customer Focus</h3>
                                    <p className="text-sm text-gray-600">Our customers are at the heart of everything we do, from design to delivery.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">Join Our Community</h2>
                        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                            Stay updated with our latest products, exclusive offers, and sustainability initiatives.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                Subscribe to Newsletter
                            </button>
                            <button className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}