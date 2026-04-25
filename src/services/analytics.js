import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Generate or retrieve a session ID for the current browser tab
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('luna_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
    sessionStorage.setItem('luna_session_id', sessionId);
  }
  return sessionId;
};

// Track a page visit
export const logPageView = async (path) => {
  try {
    const sessionId = getSessionId();
    await addDoc(collection(db, 'page_visits'), {
      sessionId,
      path,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.warn("Analytics Error (Page View):", error);
  }
};

// Heartbeat to track "Active Users Now"
export const sendActiveHeartbeat = async () => {
  try {
    const sessionId = getSessionId();
    // Use setDoc with merge to create or update the session document
    await setDoc(doc(db, 'active_sessions', sessionId), {
      lastActive: serverTimestamp(),
      platform: navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop"
    }, { merge: true });
  } catch (error) {
    console.warn("Analytics Error (Heartbeat):", error);
  }
};
