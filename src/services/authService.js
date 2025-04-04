import api from "./api";

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    } 
};

export const verifyRegistrationCode = async (email, code) => {
    try {
        const response = await api.post("/verify-reset-code", { email, code });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        console.log(email, password)
        const response = await api.post("/login", { username: email, password });
        console.log(response);
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const logoutUser = () => {
    localStorage.removeItem("token");
}


export const getUserData = async () => {
    try {
        const response = await api.get("/user");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await api.put("/updateProfile", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const requestPasswordReset = async (email) => {
    try {
        const response = await api.post("/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (token, email, newPassword) => {
    try {
        const response = await api.post("/reset-password", { 
            token, 
            email, 
            newPassword 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};