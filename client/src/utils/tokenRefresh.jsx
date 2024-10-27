import axios from '../components/axios';

export const checkAndRefreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    // Decode token to check expiration
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    // If token is about to expire in the next 5 minutes
    if (expirationTime - currentTime < 300000) {
      // Call refresh token endpoint
      const response = await axios.post('/api/refresh-token', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update token in localStorage
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    }
    
    return token;
  } catch (error) {
    // If there's an error, clear storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw error;
  }
};