import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { mockProducts } from '../data/products';

export function useProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Fallback to mock data if Firebase isn't set up yet
      setProducts(mockProducts);
      setLoading(false);
      return;
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
    }, (error) => {
      console.error("Error fetching products from Firebase:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading, isUsingMockData: !isFirebaseConfigured };
}
