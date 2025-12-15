import api from "./axios";

// 🎯 NEW: Utility function to create FormData for file uploads
const createFormData = (name, imageFile) => {
    const formData = new FormData();
    formData.append("name", name);
    
    // Append the file only if it exists
    if (imageFile) {
        // The key "imageFile" MUST match the name expected by your Spring Boot controller (@RequestParam("imageFile"))
        formData.append("imageFile", imageFile);
    }
    
    return formData;
};


// API functions for categories
export const getCategories = () => api.get("/categories");

// 🎯 MODIFIED: Now accepts name and imageFile, and sends FormData
export const addCategoryApi = (name, imageFile) => {
    const formData = createFormData(name, imageFile);
    
    // IMPORTANT: When sending FormData, the 'api' (axios) instance 
    // will automatically set the 'Content-Type' header to 'multipart/form-data'.
    return api.post("/categories", formData);
};

// 🎯 MODIFIED: Now accepts name and imageFile, and sends FormData
export const updateCategoryApi = (id, name, imageFile) => {
    const formData = createFormData(name, imageFile);

    return api.put(`/categories/${id}`, formData);
};


export const deleteCategoryApi = (id) => api.delete(`/categories/${id}`);