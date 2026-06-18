import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * An animated toggle switch for dark/light mode.
 * Shows a Sun icon in light mode and a Moon icon in dark mode
 * with a smooth sliding knob animation.
 */
const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleTheme}
      className="group flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/50 dark:hover:bg-gray-700/50"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Toggle track */}
      <div
        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
          isDarkMode ? 'bg-blue-500' : 'bg-blue-300'
        }`}
      >
        {/* Sliding knob */}
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ${
            isDarkMode ? 'left-[22px]' : 'left-0.5'
          }`}
        >
          {isDarkMode ? (
            <Moon className="w-2.5 h-2.5 text-blue-600" />
          ) : (
            <Sun className="w-2.5 h-2.5 text-amber-500" />
          )}
        </div>
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-blue-100 dark:text-gray-300 select-none">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default DarkModeToggle;
