import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  newsInteractions: {
    type: Object,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
