import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
    const token = false;
    console.log(token)
    return(
        token ? <Outlet/> : <Navigate to='/'/>
    )
}

export default PrivateRoute;