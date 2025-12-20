import React, { useState, useEffect, useRef } from "react";
import { getOrders, updateOrderStatus, deleteOrderById } from "../../api/ordersApi";
import API_URL from "../../config/api"; 

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [deleteOrderId, setDeleteOrderId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchName, setSearchName] = useState("");
    const [sortRange, setSortRange] = useState("all");
    const [updatingId, setUpdatingId] = useState(null);
    
    const listSectionRef = useRef(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrders();
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        fetchOrders();
    }, []);

    const handleSearchAction = () => {
        if (window.innerWidth < 1024) { 
            listSectionRef.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    const calculateOrderTotal = (order) =>
        order.products?.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;

    const changeStatus = async (id, newStatus) => {
        try {
            setUpdatingId(id);
            await updateOrderStatus(id, newStatus);
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
            );
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Failed to update order status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteOrder = async () => {
        try {
            await deleteOrderById(deleteOrderId);
            setOrders((prev) => prev.filter((o) => o.id !== deleteOrderId));
            setDeleteOrderId(null);
        } catch (error) {
            console.error("Failed to delete order:", error);
            alert("Failed to delete order.");
        }
    };

    const now = new Date();

    const filteredOrders =
        orders
            ?.filter((o) => (statusFilter ? o.status === statusFilter : true))
            ?.filter((o) =>
                searchName.trim()
                    ? o.customerName?.toLowerCase().includes(searchName.toLowerCase())
                    : true
            )
            ?.filter((o) => {
                const orderDate = new Date(o.date);
                const timeDiff = now.getTime() - orderDate.getTime();

                if (sortRange === "day") return timeDiff <= 24 * 60 * 60 * 1000;
                if (sortRange === "week") return timeDiff <= 7 * 24 * 60 * 60 * 1000;
                if (sortRange === "month") return timeDiff <= 30 * 24 * 60 * 60 * 1000;
                return true;
            })
            ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

    const statusColors = {
        Pending: "bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-200",
        Confirmed: "bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-200",
        Delivered: "bg-green-100 text-green-800 border-green-300 focus:ring-green-200",
        Cancelled: "bg-red-100 text-red-800 border-red-300 focus:ring-red-200",
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header and Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 mb-8 bg-white p-5 md:p-7 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center flex-shrink-0">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 whitespace-nowrap">
                        🛍️ Orders Management
                    </h1>
                </div>
                
                <div className="flex flex-col sm:flex-row flex-wrap xl:flex-nowrap gap-4 items-center flex-grow justify-end">
                    <div className="relative w-full sm:flex-1 md:max-w-xs">
                        <input
                            type="search"
                            placeholder="Search by customer..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchAction()}
                            className="w-full h-[46px] border-2 border-gray-100 px-4 pr-10 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition text-gray-900 placeholder-gray-500 bg-white"
                        />
                        <div onClick={handleSearchAction} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-indigo-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-[46px] border-2 border-gray-100 px-4 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 w-full sm:w-40 bg-gray-50/50 font-medium text-gray-700"
                    >
                        <option value="">All Status</option>
                        {Object.keys(statusColors).map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    
                    <select
                        value={sortRange}
                        onChange={(e) => setSortRange(e.target.value)}
                        className="h-[46px] border-2 border-gray-100 px-4 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 w-full sm:w-40 bg-gray-50/50 font-medium text-gray-700"
                    >
                        <option value="all">All time</option>
                        <option value="day">Last 24h</option>
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                    </select>
                </div>
            </div>
            
            <p className="text-sm font-medium text-gray-600 mb-4">
                Existing Orders ({filteredOrders.length})
            </p>

            <div ref={listSectionRef} className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-4">
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                                <p className="font-semibold">{order.customerName}</p>
                                <p className="text-sm text-gray-500">📧 Email: {order.customerEmail}</p>
                                <p className="text-sm text-gray-500">📞 Phone: {order.customerPhone}</p>
                                <p className="text-sm text-gray-500">🏙️ City: {order.city || "Not specified"}</p>
                                <p className="text-sm text-gray-500">📍 Address: {order.customerAddress}</p>
                            </div>

                            <div className="flex flex-col gap-3 items-start md:items-end w-full md:w-auto">
                                {/* PRO UNIFIED STATUS SELECTOR */}
                                <div className="relative group min-w-[140px]">
                                    <select
                                        value={order.status}
                                        onChange={(e) => changeStatus(order.id, e.target.value)}
                                        disabled={updatingId === order.id}
                                        className={`appearance-none w-full cursor-pointer pl-4 pr-10 py-2 rounded-full text-sm font-black border-2 transition-all duration-200 ${statusColors[order.status]} ${updatingId === order.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95 focus:ring-4 focus:outline-none'}`}
                                    >
                                        <option value="Pending">🕒 Pending</option>
                                        <option value="Confirmed">✅ Confirmed</option>
                                        <option value="Delivered">🚚 Delivered</option>
                                        <option value="Cancelled">❌ Cancelled</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-current opacity-70">
                                        <i className="fas fa-chevron-down text-xs"></i>
                                    </div>
                                    {updatingId === order.id && (
                                        <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Placed on</p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {order.date ? new Date(new Date(order.date).getTime() + 1 * 60 * 60 * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "No date"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setDeleteOrderId(order.id)}
                                    className="group flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                >
                                    <i className="fas fa-trash-alt opacity-70 group-hover:opacity-100"></i>
                                    Delete Order
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2">
                                <p className="font-semibold text-gray-700 mb-2">Items ordered ({order.products?.length || 0})</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {order.products?.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg text-sm border-l-4 border-indigo-400">
                                            <span className="text-gray-700 font-medium">{p.name}<span className="text-gray-500 ml-2"> (x{p.quantity})</span></span>
                                            <span className="font-bold text-gray-800">{p.price * p.quantity} DH</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l pt-4 lg:pl-4 flex flex-col justify-center">
                                <p className="text-lg font-medium text-gray-600 mb-2">Order Grand Total:</p>
                                <div className="text-3xl font-extrabold text-green-600">{calculateOrderTotal(order)} DH</div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <i className="fas fa-box-open text-4xl text-gray-400 mb-3"></i>
                        <p className="text-gray-500 font-medium">No orders found.</p>
                    </div>
                )}
            </div>

            {/* DELETE MODAL */}
            {deleteOrderId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xs md:max-w-sm text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Confirm Deletion</h2>
                        <p className="text-gray-600 mb-5">Are you sure you want to delete Order #{deleteOrderId}? This cannot be reversed.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteOrderId(null)} className="flex-1 px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition">Cancel</button>
                            <button onClick={deleteOrder} className="flex-1 px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold transition">
                                <i className="fas fa-trash-alt mr-1"></i> Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}