import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://propsol-backend-production.up.railway.app/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            const adminToken = localStorage.getItem('admin_access_token');
            const userToken = localStorage.getItem('access_token');
            
            const token = isAdminRoute ? (adminToken || userToken) : (userToken || adminToken);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const detail = error.response?.data?.detail;
        const isAuthError =
            status === 401 ||
            (status === 403 && (detail === "Could not validate credentials" || detail === "Invalid token type for this endpoint"));

        if (isAuthError) {
            if (typeof window !== 'undefined') {
                if (window.location.pathname.startsWith('/admin')) {
                    localStorage.removeItem('admin_access_token');
                    localStorage.removeItem('admin_data');
                    localStorage.removeItem('is_admin');
                    if (!window.location.pathname.startsWith('/admin/login')) {
                        window.location.href = '/admin/login';
                    }
                } else {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user_data');
                    const currentPath = window.location.pathname + window.location.search;
                    if (!window.location.pathname.startsWith('/signin') && !window.location.pathname.startsWith('/signup')) {
                        window.location.href = `/signin?returnUrl=${encodeURIComponent(currentPath)}`;
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);
