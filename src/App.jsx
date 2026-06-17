// Import React
import React from 'react';
// Import BrowserRouter from react-router-dom to enable HTML5 history API routing
import { BrowserRouter as Router } from 'react-router-dom';
// Import Toaster for global notifications
import { Toaster } from 'react-hot-toast';

// Import the Sidebar component to show on the left
import Sidebar from './components/Sidebar';
// Import our centralized routing definitions
import AppRoutes from './routes';

// Define the main App component
function App() {
  // Return the main application structure
  return (
    // Wrap the entire app in the Router component to provide routing context
    <Router>
      {/* Global Toaster for notifications */}
      <Toaster position="top-right" />
      {/* Main container: full screen height, flex row to place sidebar on the left */}
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        
        {/* Render the Sidebar on the left side of the app */}
        <Sidebar />

        {/* Main content area that expands to fill the rest of the space */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Render the application routes defined in routes/index.jsx */}
          <AppRoutes />
        </main>
        
      </div>
    </Router>
  );
}

// Export the App component as the default export
export default App;