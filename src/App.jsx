// Import React
import React from 'react';
// Import BrowserRouter from react-router-dom to enable HTML5 history API routing
import { BrowserRouter as Router } from 'react-router-dom';
// Import Toaster for global notifications
import { Toaster } from 'react-hot-toast';

// Import the Sidebar component to show on the left
import Sidebar from './components/Sidebar';
// Import DarkModeToggle for the mobile header
import DarkModeToggle from './components/common/DarkModeToggle';
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
      {/* Outer wrapper provides the deep background for ultra-wide monitors */}
      <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
        {/* Centered Application Container */}
        <div className="mx-auto max-w-[1440px] 2xl:max-w-[1600px] flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden shadow-2xl border-x border-slate-200/50 dark:border-gray-800/50 transition-colors duration-200 relative">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0 shadow-sm z-10 transition-colors duration-200">
          <span className="text-blue-800 dark:text-blue-400 font-bold text-xl tracking-tight">Startup CRM</span>
          <div className="w-24">
            <DarkModeToggle />
          </div>
        </header>

        {/* Render the Sidebar on the left side of the app (or bottom nav on mobile) */}
        <Sidebar />

        {/* Main content area that expands to fill the rest of the space. Extra bottom padding on mobile for nav bar. */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6 transition-colors duration-200 w-full">
          {/* Render the application routes defined in routes/index.jsx */}
          <AppRoutes />
        </main>
        
        </div>
      </div>
    </Router>
  );
}

// Export the App component as the default export
export default App;