import { readFileSync } from "fs";
import * as admin from "firebase-admin";
import { join } from "path";
export const firebaseConfig = {
  provide: "FIREBASE_APP",
  useFactory: () => {
    const serviceAccountPath = join("./fcm-service-account.json");
    const serviceAccount = JSON.parse(
      readFileSync(serviceAccountPath, "utf8"),
    ) as admin.ServiceAccount;
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  },
};

// This config sets up and provides a Firebase Admin SDK instance for the app.
// It reads the Firebase service account credentials from a local JSON file,
// then initializes the Firebase Admin app with these credentials.
// This allows server-side Firebase operations such as sending FCM push notifications.
