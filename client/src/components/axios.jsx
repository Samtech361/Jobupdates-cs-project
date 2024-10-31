import axios from 'axios';
import tokenService from '../utils/tokenRefresh';

const instance = axios.create({
  baseURL: 'http://localhost:5500',
  timeout: 5000,
});

instance.interceptors.request.use(
  async (config) => {
    let token = tokenService.getToken();
    
    if (token && tokenService.isTokenExpired(token)) {
      try {
        token = await tokenService.refreshToken();
      } catch (error) {
        tokenService.logout();
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = await tokenService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        tokenService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;