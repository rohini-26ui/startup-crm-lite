// Import React to define a React component
import React from 'react';
// Import Link component to allow navigation back to the home page
import { Link } from 'react-router-dom';

// Define the NotFound functional component for unmatched routes
const NotFound = () => {
  // Return the JSX structure for the 404 page
  return (
    // Container div with flexbox to center content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      {/* Large 404 heading */}
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      {/* Subheading explaining the error */}
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
      {/* Informational text */}
      <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      {/* Link to navigate back to the dashboard (home) */}
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

// Export the component as the default export
export default NotFound;
