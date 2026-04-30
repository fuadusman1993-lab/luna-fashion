import { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { checkRateLimit, sanitizeObject } from '../utils/security';

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createOrder = async (orderData) => {
    if (checkRateLimit('createOrder', 3, 60000)) {
      alert("You are creating orders too quickly. Please wait a moment.");
      throw new Error("Rate limit exceeded");
    }

    setLoading(true);
    setError(null);
    try {
      const sanitizedData = sanitizeObject(orderData);
      const payload = {
        ...sanitizedData,
        userId: currentUser ? currentUser.uid : 'guest',
        userEmail: currentUser ? currentUser.email : sanitizedData.contactPhone,
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

  const getUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'orders'), 
        where('userId', '==', currentUser ? currentUser.uid : 'guest')
      );
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoading(false);
      return ordersList.sort((a, b) => {
         const timeA = a.createdAt?.seconds || 0;
         const timeB = b.createdAt?.seconds || 0;
         return timeB - timeA;
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setLoading(false);
      return [];
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      throw err;
    }
  };

  const updateOrder = async (orderId, data) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), data);
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  };

  return { createOrder, getUserOrders, deleteOrder, updateOrder, loading, error };
}
