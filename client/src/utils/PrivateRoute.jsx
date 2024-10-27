import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
    const token = localStorage.token;
    return(
        token ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default PrivateRoute;