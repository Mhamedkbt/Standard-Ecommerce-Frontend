import api from "./axios";

export const getProducts = () => api.get("/products");

export const fetchCategories = () => api.get("/categories"); 

// ✅ CHANGED: Removed manual headers. Axios handles JSON by default.
export const addProduct = (productData) => {
  return api.post("/products", productData);
};

// ✅ CHANGED: Removed manual headers. 
export const updateProduct = (id, productData) => {
  return api.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => api.delete(`/products/${id}`);