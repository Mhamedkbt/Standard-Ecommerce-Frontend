// src/pages/Confirmation.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



const formatCurrency = (amount) =>
  `${(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} DH`;

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    } else {
      // If no order details, redirect to home
      navigate('/cart');
    }
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2">
                  {/* <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div> */}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-lg opacity-90">Thank you for your purchase</p>
              {/* <p className="text-sm opacity-75">Order #{orderDetails.id}</p> */}
            </div>
            
            {/* Order Details Section */}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500 mb-1">Order Number</p>
                      <p className="font-semibold text-lg">#{orderDetails.id}</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order Date</p>
                      <p className="font-semibold text-lg">{formatDate(orderDetails.date)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-2xl text-indigo-600">{formatCurrency(orderDetails.total)}</p>
                  </div>
                </div>
              </div>
              
              {/* Customer Information Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Information</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500 mb-1">Name</p>
                      <p className="font-semibold">{orderDetails.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-semibold">{orderDetails.customerEmail}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-semibold">{orderDetails.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                      <p className="font-semibold">Cash on Delivery</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                    <p className="font-semibold">{orderDetails.customerAddress}, {orderDetails.city}</p>
                  </div>
                </div>
              </div>
              
              {/* Next Steps Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Next?</h2>
                <div className="bg-indigo-50 rounded-xl p-6">
                  <div className="flex items-start mb-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold">Order Confirmation</p>
                      <p className="text-sm text-gray-600">You'll receive an email confirmation shortly with all your order details.</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold">Order Processing</p>
                      <p className="text-sm text-gray-600">We'll prepare your items for delivery. This usually takes 1-2 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold">Delivery</p>
                      <p className="text-sm text-gray-600">Your order will be delivered to your address. Payment will be collected upon delivery.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center"
                  onClick={() => navigate('/shop')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Continue Shopping
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition flex items-center justify-center"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}