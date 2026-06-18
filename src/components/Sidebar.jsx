// Import React library
import React from 'react';
// Import NavLink from React Router for navigation with active state styling
import { NavLink } from 'react-router-dom';
// Import icons from lucide-react
import { LayoutDashboard, Users, BarChart2 } from 'lucide-react';
// Import the DarkModeToggle component
import DarkModeToggle from './common/DarkModeToggle';

// Define the Sidebar component
const Sidebar = () => {
  // Helper function for styling active vs inactive links
  const navLinkClasses = ({ isActive }) =>
    `flex flex-col md:flex-row items-center justify-center md:justify-start flex-1 md:flex-none md:px-4 py-2 md:py-3 mb-0 md:mb-2 md:rounded-md transition-colors font-medium min-h-[44px] min-w-[44px] ${
      isActive
        ? 'text-white md:bg-blue-700 dark:md:bg-blue-600' // Active state
        : 'text-blue-300 md:text-blue-100 dark:text-gray-400 dark:md:text-gray-300 hover:bg-blue-800/50 md:hover:bg-blue-600 dark:hover:bg-gray-700 hover:text-white' // Inactive state
    }`;

  return (
    // Sidebar container: bottom nav on mobile, sidebar on tablet+
    <aside className="fixed bottom-0 left-0 w-full md:relative md:w-20 lg:w-64 bg-blue-900 md:bg-blue-800 dark:bg-gray-900 dark:md:bg-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-xl flex flex-row md:flex-col h-16 md:h-full z-50 transition-all duration-300">
      {/* Brand area at the top (hidden on mobile) */}
      <div className="hidden md:flex h-16 items-center px-4 lg:px-6 border-b border-blue-700/50 dark:border-gray-700/50 justify-center lg:justify-start shrink-0">
        <span className="text-white font-bold text-xl tracking-tight hidden lg:block">Startup CRM</span>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold lg:hidden">
          SC
        </div>
      </div>

      {/* Navigation links container */}
      <nav className="flex flex-1 md:flex-none flex-row md:flex-col px-2 md:px-4 py-0 md:py-6 overflow-y-auto items-center md:items-stretch">
        <NavLink to="/" className={navLinkClasses}>
          <LayoutDashboard className="w-6 h-6 md:w-5 md:h-5 lg:mr-3 shrink-0" />
          <span className="text-[10px] md:text-sm mt-1 md:mt-0 hidden lg:block">Dashboard</span>
        </NavLink>
        
        <NavLink to="/leads" className={navLinkClasses}>
          <Users className="w-6 h-6 md:w-5 md:h-5 lg:mr-3 shrink-0" />
          <span className="text-[10px] md:text-sm mt-1 md:mt-0 hidden lg:block">Leads</span>
        </NavLink>
        
        <NavLink to="/analytics" className={navLinkClasses}>
          <BarChart2 className="w-6 h-6 md:w-5 md:h-5 lg:mr-3 shrink-0" />
          <span className="text-[10px] md:text-sm mt-1 md:mt-0 hidden lg:block">Analytics</span>
        </NavLink>
      </nav>

      {/* Dark mode toggle & Version (hidden on mobile) */}
      <div className="hidden md:block mt-auto">
        <div className="px-4 pb-2 flex justify-center lg:justify-start">
          {/* On tablet, hide the text of the toggle to fit, or just show it if it overflows */}
          <div className="lg:w-full w-10 overflow-hidden">
            <DarkModeToggle />
          </div>
        </div>
        <div className="p-4 border-t border-blue-700/50 dark:border-gray-700/50 text-blue-200 dark:text-gray-400 text-sm flex justify-center lg:justify-start">
          <p className="hidden lg:block">Lite Version 1.0</p>
          <p className="lg:hidden text-xs">v1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
