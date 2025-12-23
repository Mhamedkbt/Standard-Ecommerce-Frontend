import React, { useState, useEffect, useRef } from "react";
import { getOrders, updateOrderStatus, deleteOrderById } from "../../api/ordersApi";
import { 
    FiSearch, FiBox, FiClock, FiCheckCircle, FiTruck, 
    FiTrash2, FiMapPin, FiPhone, FiMail, FiCalendar 
} from "react-icons/fi"; 

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

    const calculateOrderTotal = (order) =>
        order.products?.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;

    // --- Statistics (Modified) ---
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === "Pending").length,
        confirmed: orders.filter(o => o.status === "Confirmed").length,
        delivered: orders.filter(o => o.status === "Delivered").length,
    };

    const changeStatus = async (id, newStatus) => {
        try {
            setUpdatingId(id);
            await updateOrderStatus(id, newStatus);
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
            );
        } catch (error) {
            alert("Failed to update status.");
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
            alert("Failed to delete order.");
        }
    };

    const filteredOrders = orders
        ?.filter((o) => (statusFilter ? o.status === statusFilter : true))
        ?.filter((o) => searchName.trim() ? o.customerName?.toLowerCase().includes(searchName.toLowerCase()) : true)
        ?.filter((o) => {
            if (sortRange === "all") return true;
            const orderDate = new Date(o.date);
            const timeDiff = new Date().getTime() - orderDate.getTime();
            const ranges = { day: 86400000, week: 604800000, month: 2592000000 };
            return timeDiff <= ranges[sortRange];
        })
        ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

    const statusStyles = {
        Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
        Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
        Delivered: "bg-green-100 text-green-800 border-green-300",
        Cancelled: "bg-red-100 text-red-800 border-red-300",
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
            
            {/* 1. Header & Stats (Customized) */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    🛍️ Orders Management
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Orders" value={stats.total} icon={<FiBox />} color="bg-slate-800" />
                    <StatCard title="Pending" value={stats.pending} icon={<FiClock />} color="bg-yellow-500" />
                    <StatCard title="Confirmed" value={stats.confirmed} icon={<FiCheckCircle />} color="bg-blue-500" />
                    <StatCard title="Delivered" value={stats.delivered} icon={<FiTruck />} color="bg-green-500" />
                </div>
            </div>

            {/* 2. Search and Filters */}
            <div className="max-w-7xl mx-auto mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search by customer..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                    />
                </div>
                
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="md:w-44 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium outline-none"
                >
                    <option value="">All Status</option>
                    <option value="Pending">🕒 Pending</option>
                    <option value="Confirmed">✅ Confirmed</option>
                    <option value="Delivered">🚚 Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                </select>
                
                <select
                    value={sortRange}
                    onChange={(e) => setSortRange(e.target.value)}
                    className="md:w-44 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium outline-none"
                >
                    <option value="all">All time</option>
                    <option value="day">Last 24h</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                </select>
            </div>

            {/* 3. Orders List */}
            <div className="max-w-7xl mx-auto space-y-4">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-50">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">#{order.id}</span>
                                        <h3 className="font-bold text-slate-900 text-lg">{order.customerName}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                        {/* EXACT TIME ADDED HERE */}
                                        <span className="flex items-center gap-1">
                                            <FiCalendar className="text-indigo-400" /> 
                                            {order.date ? new Date(order.date).toLocaleString("en-US", { 
                                                month: "short", 
                                                day: "numeric", 
                                                year: "numeric",
                                                hour: "2-digit", 
                                                minute: "2-digit",
                                                second: "2-digit" 
                                            }) : "No date"}
                                        </span>
                                        <span className="flex items-center gap-1"><FiMapPin className="text-indigo-400" /> {order.city || "Not specified"}</span>
                                    </div>
                                </div>

                                {/* --- هذا هو الكود المعدل لخانة الـ Status --- */}
<div className="relative group min-w-[150px]">
    <select
        value={order.status}
        onChange={(e) => changeStatus(order.id, e.target.value)}
        disabled={updatingId === order.id}
        className={`appearance-none w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-black border-2 transition-all duration-200 
            ${statusStyles[order.status]} 
            ${updatingId === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md active:scale-95'}`}
    >
        <option value="Pending">🕒 Pending</option>
        <option value="Confirmed">✅ Confirmed</option>
        <option value="Delivered">🚚 Delivered</option>
        <option value="Cancelled">❌ Cancelled</option>
    </select>
    
    {/* إضافة السهم (The Arrow) */}
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {updatingId === order.id ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
        ) : (
            <svg 
                className="w-4 h-4 text-current opacity-70" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
        )}
    </div>
</div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-4 space-y-3">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Info</h4>
                                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                                        <p className="flex items-center gap-2 text-slate-700 font-medium"><FiMail className="text-slate-400" /> {order.customerEmail}</p>
                                        <p className="flex items-center gap-2 text-slate-700 font-medium"><FiPhone className="text-slate-400" /> {order.customerPhone}</p>
                                        <p className="flex items-start gap-2 text-slate-600"><FiMapPin className="text-slate-400 mt-1" /> {order.customerAddress}</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 space-y-3">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Items ({order.products?.length || 0})</h4>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                        {order.products?.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center p-2 bg-white border border-slate-100 rounded-lg text-sm">
                                                <span className="font-semibold text-slate-700">{p.name} <span className="text-indigo-500 ml-1">x{p.quantity}</span></span>
                                                <span className="font-bold text-slate-900">{p.price * p.quantity} DH</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-3 flex flex-col justify-center items-end border-l border-slate-100 pl-4">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-tight">Total Amount</span>
                                    <span className="text-3xl font-black text-green-600 leading-none mt-1">{calculateOrderTotal(order)} DH</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal remains the same but with better styling */}
            {deleteOrderId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Are you sure?</h2>
                        <p className="text-slate-500 text-center mb-8 font-medium">Order #{deleteOrderId} will be permanently removed.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteOrderId(null)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition">Cancel</button>
                            <button onClick={deleteOrder} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`h-12 w-12 rounded-2xl ${color} text-white flex items-center justify-center text-xl shadow-lg shadow-current/20`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
            </div>
        </div>
    );
}