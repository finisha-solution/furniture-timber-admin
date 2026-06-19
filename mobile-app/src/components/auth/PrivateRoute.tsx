import { Navigate, Outlet } from 'react-router-native'; 
import { useSelector } from 'react-redux'; 
export const PrivateRoute = () => { 
    const { user, isLoading } = useSelector(state => state.auth); 
    
    if (isLoading) 
        return null; 
    return user ? <Outlet /> : <Navigate to="/login" />; };