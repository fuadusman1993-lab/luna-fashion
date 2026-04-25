import { useState, useEffect, useCallback } from 'react';
import { db, isFirebaseConfigured } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const CACHE_KEY = 'luna_home_categories';

// Hardcoded fallback logic in case DB is entirely empty or offline initially
const initialMockCategories = [
  { id: 'Makhawar (ቶብ)', name: 'Makhawar', order: 1 },
  { id: 'Abaya', name: 'Abaya', order: 2 },
  { id: 'Dria', name: 'Dria', order: 3 },
  { id: 'Dresses (ቀሚስ)', name: 'Dresses', order: 4 },
  { id: 'Makeup', name: 'Makeup', order: 5 },
  { id: 'Shoes', name: 'Shoes', order: 6 },
];

export function useCategories() {
  const [categories, setCategories] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn("Failed to read categories cache", e);
    }
    return !isFirebaseConfigured ? initialMockCategories : [];
  });
  
  const [loading, setLoading] = useState(!categories.length);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(() => {
    if (!isFirebaseConfigured) {
      setCategories(initialMockCategories);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCategories = snapshot.docs.map(doc => ({
        id: doc.id, // using document ID
        ...doc.data()
      }));
      
      setCategories(fetchedCategories);
      setLoading(false);
      setError(null);
      
      // Update cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedCategories));
      } catch (e) {
        console.warn("Failed to write categories cache", e);
      }
    }, (err) => {
      console.error("Error fetching categories from Firebase:", err);
      if (!categories.length) {
         setError("No Connection");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [categories.length]);

  useEffect(() => {
    const unsubscribe = fetchCategories();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []); // Only run once on mount

  return { categories, loading, error, retryFetch: fetchCategories };
}
