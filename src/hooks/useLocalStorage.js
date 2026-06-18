import { useState, useCallback } from 'react';

/**
 * Safely checks whether the localStorage API is available and functional.
 * This can fail in private/incognito browsing modes in some browsers, or when
 * storage quota has been exceeded, or when storage access is blocked by policy.
 *
 * @returns {boolean} True if localStorage is available, false otherwise.
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__useLocalStorage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * A custom React hook that provides a stateful value backed by localStorage,
 * offering an identical API to React's built-in `useState`.
 *
 * Features:
 * - Reads initial value from localStorage on first render (or falls back to `initialValue`).
 * - Writes to localStorage atomically with every state update.
 * - Handles JSON parse/stringify errors gracefully — never crashes the app.
 * - Degrades gracefully when localStorage is unavailable (e.g. private browsing,
 *   storage quota exceeded, or browser policy restrictions) by behaving like
 *   plain `useState`.
 * - Works with any JSON-serialisable type: arrays, objects, strings, numbers,
 *   and booleans.
 *
 * @template T
 * @param {string} key - The localStorage key under which the value is stored.
 * @param {T} initialValue - The value to use when no stored value is found, or
 *   when the stored value cannot be parsed.
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} A tuple of
 *   `[storedValue, setValue]` — identical in shape to the `useState` return value.
 *
 * @example
 * // Persist a boolean (e.g. dark mode preference)
 * const [isDark, setIsDark] = useLocalStorage('theme-dark', false);
 *
 * @example
 * // Persist an array of objects (e.g. CRM leads)
 * const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);
 */
function useLocalStorage(key, initialValue) {
  // Determine once whether localStorage is available in this browser/context.
  // We memoize this outside of state so it is computed only on module load.
  const storageAvailable = isLocalStorageAvailable();

  /**
   * Lazy initialiser for useState: runs only once on mount.
   * Tries to read the existing value from localStorage and parse it as JSON.
   * If the key does not exist or parsing fails, falls back to `initialValue`.
   *
   * @returns {T}
   */
  const [storedValue, setStoredValue] = useState(() => {
    // If localStorage is not accessible, skip the read and use the default.
    if (!storageAvailable) {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);

      // `null` means the key was never written — use the provided initialValue.
      if (item === null) {
        return initialValue;
      }

      // Parse the JSON string back to its original type.
      return JSON.parse(item);
    } catch (error) {
      // A SyntaxError here means the stored data is corrupted or was written
      // by a different serialiser. Log it and fall back safely.
      console.warn(
        `[useLocalStorage] Failed to parse value for key "${key}". ` +
          'Falling back to initialValue.',
        error
      );
      return initialValue;
    }
  });

  /**
   * Setter function — mirrors the React `setState` signature.
   * Accepts either a new value directly or a functional updater `(prev) => next`.
   * Writes the new value to both React state and localStorage atomically.
   *
   * @param {T | ((prev: T) => T)} value - The new value or an updater function.
   * @returns {void}
   */
  const setValue = useCallback(
    (value) => {
      try {
        // Support functional updater pattern, identical to useState's setter.
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Update React state first so the UI re-renders immediately.
        setStoredValue(valueToStore);

        // Persist to localStorage only if it is available.
        if (storageAvailable) {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // Possible reasons: storage quota exceeded, value not JSON-serialisable,
        // or localStorage access revoked mid-session.
        console.error(
          `[useLocalStorage] Failed to save value for key "${key}" to localStorage.`,
          error
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, storedValue, storageAvailable]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
