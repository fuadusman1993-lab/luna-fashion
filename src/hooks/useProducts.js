import { useState, useEffect, useCallback, useRef } from 'react';
import { db, isFirebaseConfigured } from '../services/firebase';
import { collection, query, orderBy, limit, startAfter, where, getDocs } from 'firebase/firestore';
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

export function useProducts({ category, filter } = {}) {
  const [products, setProducts] = useState(isFirebaseConfigured ? [] : localProductsState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    setError(null);

    if (!isFirebaseConfigured) {
      let filtered = [...localProductsState];
      if (category && category !== 'All') {
        const target = category.split('(')[0].toLowerCase().trim();
        filtered = filtered.filter(p => {
          if (!p.category) return false;
          const pCat = p.category.split('(')[0].toLowerCase().trim();
          return pCat === target || pCat.includes(target) || target.includes(pCat);
        });
      }
      if (filter === 'New In') filtered = filtered.filter(p => p.isNewIn);
      if (filter === 'Deals') filtered = filtered.filter(p => p.isDeal);
      if (filter === 'Best') filtered = filtered.filter(p => p.isBestseller);

      setProducts(filtered);
      setHasMore(false);
      setLoading(false);
      return;
    }

    try {
      let queryConstraints = [orderBy("createdAt", "desc")];
      
      if (category && category !== 'All') {
        queryConstraints.push(where("category", "==", category));
      }
      if (filter === 'New In') queryConstraints.push(where("isNewIn", "==", true));
      if (filter === 'Deals') queryConstraints.push(where("isDeal", "==", true));
      if (filter === 'Best') queryConstraints.push(where("isBestseller", "==", true));

      queryConstraints.push(limit(20));

      if (isLoadMore && lastDoc) {
        queryConstraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, "products"), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isLoadMore) {
        setProducts(prev => [...prev, ...fetchedProducts]);
      } else {
        setProducts(fetchedProducts);
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === 20);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products from Firebase:", err);
      setError("No Connection");
      setLoading(false);
    }
  }, [category, filter, lastDoc]);

  // Initial fetch and refetch on filter change
  useEffect(() => {
    setLastDoc(null); // Reset pagination on filter change
  }, [category, filter]);

  // This effect runs fetchProducts when lastDoc is reset (null) or on mount
  useEffect(() => {
    if (lastDoc === null) {
       fetchProducts(false);
    }
  }, [lastDoc, fetchProducts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(true);
    }
  };

  return { products, loading, error, retryFetch: () => fetchProducts(false), loadMore, hasMore, isUsingMockData: !isFirebaseConfigured };
}
