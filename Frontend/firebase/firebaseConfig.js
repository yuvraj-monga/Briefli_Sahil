import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAnAD0ElH9tmBE5KINWP6eTl742imLcOBQ",
  authDomain: "briefli-prod.firebaseapp.com",
  projectId: "briefli-prod",
  storageBucket: "briefli-prod.appspot.com",
  messagingSenderId: "609971754508",
  appId: "1:609971754508:web:68217e24d11476ed204029",
  measurementId: "G-D98GE6TSY3",
  databaseURL: "https://briefli-prod-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, analytics, database };