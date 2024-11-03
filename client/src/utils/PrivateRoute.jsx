import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../utils/AuthContext'; 
import tokenService from '../utils/tokenRefresh';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const token = tokenService.getToken();

  // Check if token exists and is not expired
  const isValidToken = token && !tokenService.isTokenExpired(token);

  // If token is invalid but exists, try to refresh it
  if (token && !isValidToken) {
    tokenService.refreshToken()
      .catch(() => {
        // If refresh fails, tokenService.logout() will handle the cleanup
        tokenService.logout();
      });
  }

  return isValidToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;