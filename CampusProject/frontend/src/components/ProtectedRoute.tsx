import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const userJson = localStorage.getItem('vexo_user');
  const user = userJson ? JSON.parse(userJson) : null;
  const token = localStorage.getItem('vexo_token');

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If user is not admin but tries to access admin, send to dashboard or home
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
