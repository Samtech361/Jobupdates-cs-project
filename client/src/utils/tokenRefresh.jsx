import { jwtDecode } from 'jwt-decode'; 

class TokenService {
  constructor() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 300; // 5 minutes buffer
  }

  onTokenRefreshed(token) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  addRefreshSubscriber(callback) {
    this.refreshSubscribers.push(callback);
  }

  async refreshToken() {
    try {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        const response = await axios.post('/api/auth/refresh');
        const { token } = response.data;
        this.setToken(token);
        this.onTokenRefreshed(token);
        return token;
      }
      
      return new Promise(resolve => {
        this.addRefreshSubscriber(token => {
          resolve(token);
        });
      });
    } catch (error) {
      this.logout();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}

const tokenService = new TokenService();
export default tokenService;