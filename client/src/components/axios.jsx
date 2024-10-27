import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5500', // Make sure this matches your backend URL
  timeout: 5000,
});

// Add a request interceptor to automatically add the token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error.response || error);
    return Promise.reject(error);
  }
);

export default instance;