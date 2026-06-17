// Import React and lazy, Suspense from React for lazy loading components
import React, { lazy, Suspense } from 'react';
// Import routing components from react-router-dom
import { Routes, Route } from 'react-router-dom';

// Lazy load the page components to improve initial load performance
// React.lazy takes a function that must call a dynamic import()
const Dashboard = lazy(() => import('../pages/Dashboard'));
const LeadManagement = lazy(() => import('../pages/LeadManagement'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

// A simple loading fallback component to display while chunks are being downloaded
const LoadingFallback = () => (
  // Centered loading text with some padding and gray color
  <div className="flex justify-center items-center p-12 text-gray-500">
    Loading...
  </div>
);

// Define the AppRoutes component which contains all the route definitions
const AppRoutes = () => {
  return (
    // Suspense wraps the lazy components and shows the fallback UI while they load
    <Suspense fallback={<LoadingFallback />}>
      {/* Routes is the v6 container for all Route definitions */}
      <Routes>
        {/* Define the index route (path="/") which renders the Dashboard component */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Define the route for Lead Management at path="/leads" */}
        <Route path="/leads" element={<LeadManagement />} />
        
        {/* Define the route for Analytics at path="/analytics" */}
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Catch-all route for paths that don't match any of the above (404 Not Found) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Export the routing component to be used in App.jsx
export default AppRoutes;
