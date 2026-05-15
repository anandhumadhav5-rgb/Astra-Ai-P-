import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (serviceAccountStr) {
      const serviceAccount = JSON.parse(serviceAccountStr);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId,
      });
    } else {
      // Running without a service account (dev mode)
      // verifyIdToken still works using Google's public keys — no service account needed for that.
      console.warn(
        '[firebase-admin] FIREBASE_SERVICE_ACCOUNT is not set. ' +
        'Token verification uses Google public keys (works for verifyIdToken). ' +
        'Some admin-only features (e.g. custom claims, listing users) will NOT work.'
      );
      admin.initializeApp({
        projectId,
      });
    }
  } catch (error) {
    console.error('[firebase-admin] Initialization error:', error);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
