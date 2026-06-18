/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export const ThemeContext = createContext(null);

/**
 * ThemeProvider component manages the application's light/dark theme state.
 * The preference is persisted to localStorage under 'startup-crm-theme' so that
 * the user's choice is remembered across sessions and page refreshes.
 * It also synchronises the preference with the root document class so that
 * CSS dark-mode selectors work correctly.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element} The rendered Provider wrapper.
 */
export const ThemeProvider = ({ children }) => {
  // useLocalStorage reads from 'startup-crm-theme' on first render.
  // Defaults to `false` (light mode) if no stored preference is found.
  // Every setIsDarkMode call automatically persists the new value to localStorage.
  const [isDarkMode, setIsDarkMode] = useLocalStorage('startup-crm-theme', false);

  // Apply or remove the 'dark' class on the document root whenever isDarkMode changes.
  // This drives all CSS dark-mode selectors (e.g. `.dark .some-class { ... }`).
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggles the theme between light and dark modes.
   * The new value is automatically saved to localStorage via useLocalStorage.
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
