import axiosConfig from "../axiosConfig.tsx";

const login = async (email: string, password: string) => {
    const response = await axiosConfig.post(`/auth/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response;
};

const getCurrentUser = () => {
    return {
        token: localStorage.getItem('token') || ''
    };
};

const authService = {
    login,
    getCurrentUser
};

export default authService;
