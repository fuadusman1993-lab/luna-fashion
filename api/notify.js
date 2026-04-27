import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { category, productName } = req.body;
    
    // Fetch all tokens from Firestore
    const db = admin.firestore();
    const tokensSnapshot = await db.collection('fcm_tokens').get();
    
    if (tokensSnapshot.empty) {
      return res.status(200).json({ message: 'No tokens found' });
    }
    
    const tokens = [];
    tokensSnapshot.forEach(doc => {
      if (doc.data().token) {
        tokens.push(doc.data().token);
      }
    });

    const payload = {
      notification: {
        title: '🌙 New Arrival at Luna!',
        body: `Check out our latest ${category} now.`,
      },
      data: {
        category: category || '',
        productName: productName || ''
      }
    };

    // Send notifications to all users
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: payload.notification,
      data: payload.data
    });

    res.status(200).json({ 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount 
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}
