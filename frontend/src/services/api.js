import axios from 'axios';

const API_BASE_URL =  process.env.REACT_APP_BASE_URL || 'https://budget-tracker-api-zfok.onrender.com/api';
// console.log(process.env.REACT_APP_BASE_URL)
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const login = async (username, password) => {
    const response = await api.post('/login/', { username, password });
    const { access, refresh, user } = response.data;
    
    // Store tokens and user data
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

// Categories API
export const fetchCategories = async (type = null) => {
    try {
        const params = type ? { type } : {};
        const response = await api.get('/categories/', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories/', categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/categories/${id}/`, categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteCategory = async (id) => {
    try {
        await api.delete(`/categories/${id}/`);
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Transactions API
export const fetchTransaction = async (id) => {
    const response = await api.get(`/transactions/${id}/`);
    return response.data;
};

export const fetchTransactions = async (params = {}) => {
    try {
        // Convert date objects to strings if they exist
        const queryParams = { ...params };
        if (queryParams.start_date instanceof Date) {
            queryParams.start_date = queryParams.start_date.toISOString().split('T')[0];
        }
        if (queryParams.end_date instanceof Date) {
            queryParams.end_date = queryParams.end_date.toISOString().split('T')[0];
        }
        
        const response = await api.get('/transactions/', { params: queryParams });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createTransaction = async (transactionData) => {
    try {
        const response = await api.post('/transactions/', transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await api.put(`/transactions/${id}/`, transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteTransaction = async (id) => {
    try {
        await api.delete(`/transactions/${id}/`);
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Budgets API
export const fetchBudgets = async () => {
    try {
        const response = await api.get('/budgets/');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const fetchBudgetByMonth = async (month, year) => {
    try {
        const response = await api.get('/budgets/', {
            params: { month, year }
        });
        return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createBudget = async (budgetData) => {
    try {
        const response = await api.post('/budgets/', budgetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateBudget = async (id, budgetData) => {
    try {
        const response = await api.put(`/budgets/${id}/`, budgetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteBudget = async (id) => {
    try {
        await api.delete(`/budgets/${id}/`);
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Dashboard API
export const fetchDashboardSummary = async (month = null, year = null) => {
    try {
        const params = {};
        if (month) params.month = month;
        if (year) params.year = year;
        
        const response = await api.get('/dashboard/', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;
