import { app, db, messaging } from '../services/firebase';
import { getToken } from 'firebase/messaging';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export const useMessaging = () => {
  const { user } = useAuth();
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!messaging) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // VAPID key is required to receive push notifications.
          // Note: In a real app, generate a VAPID key in Firebase Console -> Project Settings -> Cloud Messaging -> Web configuration
          // For now, getToken might work without it if configured correctly, but a VAPID key is best practice.
          const token = await getToken(messaging, { 
            vapidKey: 'BOx5p7N9x4KcY5qsxyw8vTFh5k5yGOJiyYyd_FUvTuV3XOsG0Z6RSnfN0OjrQr3q8qZCJO5fYYikqvgUnhzzhsw' 
          });
          
          if (token) {
            setFcmToken(token);
            // Save token to firestore if user is logged in
            if (user) {
              const tokenRef = doc(db, 'fcm_tokens', token);
              await setDoc(tokenRef, {
                token: token,
                userId: user.uid,
                updatedAt: serverTimestamp(),
              });
            } else {
              // Also save for anonymous guests
              const tokenRef = doc(db, 'fcm_tokens', token);
              await setDoc(tokenRef, {
                token: token,
                userId: 'anonymous',
                updatedAt: serverTimestamp(),
              }, { merge: true });
            }
          }
        }
      } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
        // Alert to help debug why it's not working
        if (error.code === 'messaging/missing-app-config-values' || error.message.includes('vapidKey')) {
          console.warn('VAPID Key is missing. Notifications might not work in this browser.');
        } else {
          console.warn('FCM Token Error:', error.message);
        }
      }
    };

    requestNotificationPermission();
  }, [user]);

  return { fcmToken };
};
