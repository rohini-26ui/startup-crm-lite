// Import React to define a React component
import React from 'react';

// Define the Analytics functional component
const Analytics = () => {
  // Return the JSX structure for the Analytics page
  return (
    // Container div with Tailwind CSS classes for padding and text styling
    <div className="p-8">
      {/* Main heading for the Analytics page */}
      <h1 className="text-3xl font-bold mb-4">Analytics</h1>
      {/* A simple descriptive paragraph */}
      <p className="text-gray-600">View your CRM analytics and metrics.</p>
    </div>
  );
};

// Export the component as the default export for lazy loading
export default Analytics;
