import axios from "axios";

const api = axios.create({
    baseURL: "https://ternurines-back.onrender.com",
});

// Interceptor para añadir el token en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    } 
);
 
export default api;
