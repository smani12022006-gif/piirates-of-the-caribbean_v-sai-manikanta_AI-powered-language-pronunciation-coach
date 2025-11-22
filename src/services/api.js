import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile')
};

// Language APIs
export const languageAPI = {
    getList: () => api.get('/language/list'),
    select: (language) => api.put('/language/select', { language })
};

// Practice APIs
export const practiceAPI = {
    getContent: (language, category) => api.get('/practice/content', { params: { language, category } }),
    submitScore: (data) => api.post('/practice/score', data),
    getHistory: () => api.get('/practice/history')
};

export default api;
