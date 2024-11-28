import admin from "firebase-admin";

import { readFile } from "fs/promises"; // To load the JSON file in ES module syntax

// Asynchronously read the service account JSON file
const serviceAccount = JSON.parse(
  await readFile(
    new URL(
      "./briefli-prod-firebase-adminsdk-j5gtz-648683fa4e.json",
      import.meta.url
    )
  )
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://briefli-prod-default-rtdb.firebaseio.com", // Replace with your Firebase database URL
});

// Export the Firebase Admin instance and database
const database = admin.database();
export { database };
