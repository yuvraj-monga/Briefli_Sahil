import express from "express";
import { database } from "./firebase/firebaseAdminconfig.js"; 
import { MongoClient } from "mongodb"; 
import cron from "cron";

const app = express();

// MongoDB connection string
const MONGO_URL =
  "mongodb+srv://mirzanausadallibaig:Sahil%23123@cluster0.mhg9q.mongodb.net?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your actual MongoDB connection string

// Initialize MongoDB client
const client = new MongoClient(MONGO_URL);
let db;

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await client.connect();
    db = client.db("user_analytics");
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Create the collection for user data
const createCollection = async () => {
  const userCollection = db.collection("userData");
  await userCollection.createIndex({ userId: 1 }, { unique: true }); 
};

const fetchAndStoreData = async () => {
  console.log("Fetching data from Firebase...");

  try {
    const ref = database.ref("users");
    const snapshot = await ref.once("value");
    const usersData = snapshot.val(); 

    if (usersData) {
      const userCollection = db.collection("userData");

      for (const userId in usersData) {
        const userInteractions = usersData[userId].newsInteractions;

        const newsInteractionsJSON = userInteractions; 

        const existingUser = await userCollection.findOne({ userId });

        if (existingUser) {
          await userCollection.updateOne(
            { userId },
            { $set: { newsInteractions: newsInteractionsJSON } }
          );
          console.log(`Updated interactions for user: ${userId}`);
        } else {
          await userCollection.insertOne({
            userId,
            newsInteractions: newsInteractionsJSON,
          });
          console.log(`Inserted new interactions for user: ${userId}`);
        }
      }
    } else {
      console.log("No data found in Firebase.");
    }
  } catch (error) {
    console.error("Error fetching or saving data:", error);
  }
};

app.get("/fetch-data", async (req, res) => {
  await fetchAndStoreData();
  res.send("Data fetched and stored in MongoDB.");
});

app.get("/", (req, res) => {
  res.send("Backend with Firebase and MongoDB is running!");
});

// Start MongoDB connection and create collection
connectToMongoDB().then(createCollection).catch(console.error);

const cronJob = new cron.CronJob("*/1 * * * *", fetchAndStoreData);
cronJob.start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
