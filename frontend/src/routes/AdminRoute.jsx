import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';

export default function AdminRoute() {
  const user = useSelector(selectCurrentUser);
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
