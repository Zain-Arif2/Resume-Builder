import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useGetMeQuery } from '@/features/auth/authApi';
import { setCredentials, selectIsAuthenticated } from '@/features/auth/authSlice';
import PageLoader from '@/components/common/PageLoader';

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: isAuthenticated,
  });

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(setCredentials({ user: data.data.user }));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
