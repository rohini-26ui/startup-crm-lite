// Import React and lazy, Suspense from React for lazy loading components
import React, { lazy, Suspense } from 'react';
// Import routing components from react-router-dom
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Lazy load the page components to improve initial load performance
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

// A simple loading fallback component to display while chunks are being downloaded
const LoadingFallback = () => (
  <div className="flex justify-center items-center p-12 text-gray-500">
    Loading...
  </div>
);

// ProtectedRoute component
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Define the AppRoutes component which contains all the route definitions
const AppRoutes = () => {
  return (
    // Suspense wraps the lazy components and shows the fallback UI while they load
    <Suspense fallback={<LoadingFallback />}>
      {/* Routes is the v6 container for all Route definitions */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        
        {/* Catch-all route for paths that don't match any of the above (404 Not Found) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Export the routing component to be used in App.jsx
export default AppRoutes;
