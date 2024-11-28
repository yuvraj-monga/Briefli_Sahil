import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import newsRoutes from "./routes/newsRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/news", newsRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((error) => {
    console.error("MongoDB connection error: ", error);
  });

const PORT = process.env.PORT || 4848;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
