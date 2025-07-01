import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Store callbacks for authentication state changes
let authStateCallbacks = [];

const register = async (username, email, password) => {
    const response = await axios.post(API_URL + 'register', {
        username,
        email,
        password,
    });
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(API_URL + 'login', {
        email,
        password,
    });
    if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.accessToken);
        // Notify all callbacks about auth state change
        notifyAuthStateChange(response.data.user);
    }
    return response.data.user;
};

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Notify all callbacks about auth state change
    notifyAuthStateChange(null);
};

const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            return parsedData.user || parsedData;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
    return null;
};

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();
    return !!(token && user);
};

const onAuthStateChanged = (callback) => {
    authStateCallbacks.push(callback);
    
    // Immediately call with current user state
    const currentUser = getCurrentUser();
    callback(currentUser);
    
    // Return unsubscribe function
    return () => {
        authStateCallbacks = authStateCallbacks.filter(cb => cb !== callback);
    };
};

const notifyAuthStateChange = (user) => {
    authStateCallbacks.forEach(callback => {
        try {
            callback(user);
        } catch (error) {
            console.error('Error in auth state callback:', error);
        }
    });
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    onAuthStateChanged,
};

export { authService };
export default authService;