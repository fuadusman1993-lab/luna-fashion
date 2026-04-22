import { useState, useEffect, useCallback } from 'react';
import { db, isFirebaseConfigured } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { mockProducts } from '../data/products';

let localProductsState = [...mockProducts];
let subscribers = [];

const notifySubscribers = () => {
  subscribers.forEach(fn => fn([...localProductsState]));
};

export const updateLocalProduct = (id, payload) => {
  localProductsState = localProductsState.map(p => p.id === id ? { ...p, ...payload } : p);
  notifySubscribers();
};

export const addLocalProduct = (payload) => {
  const newProduct = { ...payload, id: `luna_${Date.now()}` };
  localProductsState = [newProduct, ...localProductsState];
  notifySubscribers();
};

export const deleteLocalProduct = (id) => {
  localProductsState = localProductsState.filter(p => p.id !== id);
  notifySubscribers();
};

export function useProducts() {
  const [products, setProducts] = useState(isFirebaseConfigured ? [] : localProductsState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    if (!isFirebaseConfigured) {
      // Fallback to mock data if Firebase isn't set up yet
      setProducts(localProductsState);
      const handler = (newProds) => setProducts(newProds);
      subscribers.push(handler);
      setLoading(false);
      return () => {
        subscribers = subscribers.filter(fn => fn !== handler);
      };
    }

    // Set up real-time listener for Firestore collection "products"
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(fetchedProducts);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching products from Firebase:", err);
      setError("No Connection");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchProducts();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return { products, loading, error, retryFetch: fetchProducts, isUsingMockData: !isFirebaseConfigured };
}
