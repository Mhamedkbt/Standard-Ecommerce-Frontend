import api from "./axios";

// Create a new order
export const createOrder = (orderData) => {
  const payload = {
    ...orderData,
    products: orderData.products.map((p) => ({
      name: p.name,
      price: p.price,
      quantity: p.quantity,
    })),
  };

  return api.post("/orders", payload);
};

// Get all orders
export const getOrders = () => api.get("/orders");

// Update order status
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

// Delete order
export const deleteOrderById = (id) => api.delete(`/orders/${id}`);
