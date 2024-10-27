import axios from 'axios';
import { checkAndRefreshToken } from '../utils/tokenRefresh';

const instance = axios.create({
  baseURL: 'http://localhost:5500',
  timeout: 5000,
});

//request interceptor to automatically add the token
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

// //axios interceptor to automatically refresh token
// instance.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await checkAndRefreshToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


//response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error.response || error);
    return Promise.reject(error);
  }
);

export default instance;