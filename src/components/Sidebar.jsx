// Import React library
import React from 'react';
// Import NavLink from React Router for navigation with active state styling
import { NavLink } from 'react-router-dom';
// Import icons from lucide-react if available or we can just use text.
import { LayoutDashboard, Users, BarChart2 } from 'lucide-react';

// Define the Sidebar component
const Sidebar = () => {
  // Helper function for styling active vs inactive links
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 mb-2 rounded-md transition-colors font-medium ${
      isActive
        ? 'bg-blue-700 text-white' // Active state
        : 'text-blue-100 hover:bg-blue-600 hover:text-white' // Inactive state
    }`;

  return (
    // Sidebar container: fixed width, full height, distinct background
    <aside className="w-64 bg-blue-800 shadow-xl flex flex-col h-full">
      {/* Brand area at the top */}
      <div className="h-16 flex items-center px-6 border-b border-blue-700/50">
        <span className="text-white font-bold text-xl tracking-tight">Startup CRM</span>
      </div>

      {/* Navigation links container */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <NavLink to="/" className={navLinkClasses}>
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        
        <NavLink to="/leads" className={navLinkClasses}>
          <Users className="w-5 h-5 mr-3" />
          Leads
        </NavLink>
        
        <NavLink to="/analytics" className={navLinkClasses}>
          <BarChart2 className="w-5 h-5 mr-3" />
          Analytics
        </NavLink>
      </nav>

      {/* Optional bottom area for user profile or settings */}
      <div className="p-4 border-t border-blue-700/50 text-blue-200 text-sm">
        <p>Lite Version 1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
