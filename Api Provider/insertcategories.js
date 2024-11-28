import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error: ", error);
  });

// List of categories to insert
const categories = [
  "business",
  "science",
  "health",
  "world",
  "sport",
  "politics",
  "entertainment",
  "technology",
  "education",
  "environment",
  "travel",
  "lifestyle",
  "crime",
  "opinion",
  "weather",
  "culture",
  "art",
  "food",
  "automotive",
  "finance",
  "international",
];

// Function to insert categories
async function insertCategories() {
  try {
    for (const categoryName of categories) {
      // Check if the category already exists
      const existingCategory = await Category.findOne({ name: categoryName });
      if (!existingCategory) {
        const category = new Category({ name: categoryName });
        await category.save();
        console.log(`Inserted category: ${categoryName}`);
      } else {
        console.log(`Category already exists: ${categoryName}`);
      }
    }
    console.log("Category insertion completed");
  } catch (error) {
    console.error("Error inserting categories:", error);
  } finally {
    mongoose.disconnect();
  }
}

// Call the function to insert categories
insertCategories();