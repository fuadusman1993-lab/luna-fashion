import { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...orderData,
        userId: currentUser ? currentUser.uid : 'guest',
        userEmail: currentUser ? currentUser.email : orderData.contactPhone,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), payload);
      setLoading(false);
      return docRef.id;
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { createOrder, loading, error };
}
