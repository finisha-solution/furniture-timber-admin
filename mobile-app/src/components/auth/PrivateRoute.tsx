import { Navigate, Outlet } from 'react-router-native';
import { useSelector } from 'react-redux';

export const PrivateRoute = () => {
  const { user, isLoading } = useSelector((state: any) => state.auth);

  if (isLoading) {
    return null; // Shows splash until loading resolves
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
};