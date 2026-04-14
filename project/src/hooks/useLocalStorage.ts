import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useLocalStorageArray<T>(key: string) {
  const [items, setItems] = useLocalStorage<T[]>(key, []);

  const addItem = (item: T) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (predicate: (item: T) => boolean) => {
    setItems((prev) => prev.filter((item) => !predicate(item)));
  };

  const updateItem = (predicate: (item: T) => boolean, updater: (item: T) => T) => {
    setItems((prev) =>
      prev.map((item) => (predicate(item) ? updater(item) : item))
    );
  };

  return { items, addItem, removeItem, updateItem, setItems };
}
