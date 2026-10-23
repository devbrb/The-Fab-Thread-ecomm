import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";

function ProtectedRoute({children}) {
    const {isUserLoading, isAuthenticated} = useSelector((store) => store.cartStates);

    if(isUserLoading){
        return <Spinner />
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    if(isAuthenticated) return children;
}

export default ProtectedRoute
