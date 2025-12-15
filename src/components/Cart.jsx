// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0.00 DH';
    return `${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;
};

const CartItem = ({ item }) => {
    const { addItem, removeItem, removeProduct } = useCart();

    const handleIncrease = () => addItem(item, 1);
    const handleDecrease = () => removeItem(item.id, 1);
    const handleRemoveProduct = () => removeProduct(item.id);

    const itemImage = item.image || 'https://via.placeholder.com/64x64?text=No+Image';

    return (
        <li className="py-4 px-2 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {/* Product info section */}
                <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-md border border-gray-200 flex-shrink-0">
                        <img src={itemImage} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <Link to={`/product/${item.id}`} className="text-base sm:text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-2">
                            {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatCurrency(item.price)} per item
                        </p>
                        <div className="sm:hidden mt-2 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                            <button onClick={handleRemoveProduct} className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50" aria-label={`Remove ${item.name} from cart`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Controls section */}
                <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <button onClick={handleDecrease} disabled={item.quantity <= 1} className="p-2 w-8 sm:w-10 h-full text-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center" aria-label="Decrease quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="w-8 sm:w-10 text-center text-md font-medium text-gray-700">{item.quantity}</span>
                        <button onClick={handleIncrease} className="p-2 w-8 sm:w-10 h-full text-lg text-gray-600 hover:bg-gray-100 transition flex items-center justify-center" aria-label="Increase quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <span className="text-lg font-bold w-20 sm:w-24 text-right hidden sm:inline">{formatCurrency(item.price * item.quantity)}</span>

                    <button onClick={handleRemoveProduct} className="hidden sm:block text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50" aria-label={`Remove ${item.name} from cart`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, cartTotal, totalItems, clearCart } = useCart();
    const [showClearModal, setShowClearModal] = useState(false);

    const subtotal = cartTotal;
    const deliveryCost = 0;
    const grandTotal = subtotal + deliveryCost;

    if (totalItems === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Navbar />
                <main className="container mx-auto px-4 md:px-8 py-16">
                    <div className="text-center bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Your Shopping Cart is Empty</h1>
                        <p className="text-gray-600 mb-6 px-4">Looks like you haven't added anything to your cart yet. Head back to the shop to find some amazing products!</p>
                        <Link to="/shop" className="inline-flex items-center bg-indigo-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-full transition hover:bg-indigo-700 shadow-xl">
                            Start Shopping Now
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleCheckoutClick = () => {
        // Send only required fields to checkout
        const simplifiedCartItems = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));
        navigate('/checkout', { state: { cartItems: simplifiedCartItems, grandTotal } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 md:px-8 py-8 sm:py-10 md:py-16">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">Your Shopping Cart</h1>
                    <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                    <p className="text-gray-600 mt-3">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Cart Items
                                </h2>
                                <button onClick={() => setShowClearModal(true)} className="text-sm text-red-500 hover:text-red-700 font-medium transition flex items-center" aria-label="Clear all items from cart">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Clear Cart
                                </button>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {cartItems.map(item => <CartItem key={item.id} item={item} />)}
                            </ul>

                            <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
                                <Link to="/shop" className="text-indigo-600 hover:text-indigo-800 font-medium transition flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-4">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Delivery</span>
                                    <span className="font-medium">{formatCurrency(deliveryCost)}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-gray-900">
                                    <span>Order Total</span>
                                    <span>{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            {/* <div className="bg-indigo-50 p-4 rounded-xl mb-6">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-indigo-700">Free delivery on orders over 200 DH</p>
                                </div>
                            </div> */}

                            <button onClick={handleCheckoutClick} className="w-full bg-indigo-600 text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center">
                                Proceed to Checkout
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Secure checkout
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clear Cart Confirmation Modal */}
                {showClearModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Clear Cart</h2>
                            <p className="mb-6 text-gray-600">
                                Are you sure you want to remove all items from your cart?
                            </p>
                            <div className="flex justify-between mt-4 gap-3">
                                <button onClick={() => setShowClearModal(false)} className="px-4 sm:px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 flex-1 font-semibold transition">Cancel</button>
                                <button 
                                    onClick={() => { clearCart(); setShowClearModal(false); }} 
                                    className="px-4 sm:px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white flex-1 font-semibold transition"
                                >
                                    Yes, Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}