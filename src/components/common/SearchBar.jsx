import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * A controlled search input component that debounces changes by 300ms.
 *
 * @param {{ value: string, onChange: function }} props
 * @returns {JSX.Element} The rendered SearchBar component.
 */
const SearchBar = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex-1 max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 transition-all text-sm shadow-sm"
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search leads by name, company, or email"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Clear search query"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
