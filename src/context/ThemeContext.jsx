/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

/**
 * ThemeProvider component manages the application's light/dark theme state.
 * It synchronizes the state with localStorage and modifies the root document class accordingly.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element} The rendered Provider wrapper.
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('isDarkMode');
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error('Failed to parse theme from localStorage:', error);
      return false;
    }
  });

  // Apply or remove the 'dark' class to document.documentElement based on isDarkMode state
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Failed to sync theme class/storage:', error);
    }
  }, [isDarkMode]);

  /**
   * Toggles the theme between light and dark modes.
   * 
   * @returns {void}
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom React hook to consume the ThemeContext.
 * 
 * @returns {{
 *   isDarkMode: boolean,
 *   toggleTheme: () => void
 * }} The theme context value.
 * @throws {Error} If consumed outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
