import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT (if logged in) and, for superadmin accounts only, the
// x-library-id header the backend's tenantMiddleware expects. Regular
// student/admin accounts don't need this — their own account already
// carries a libraryId server-side.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const impersonatedLibraryId = sessionStorage.getItem('superadmin_libraryId');
  if (impersonatedLibraryId) {
    config.headers['x-library-id'] = impersonatedLibraryId;
  }

  return config;
});

// Centralized 401 handling — bounce to login if the token is invalid/expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
