import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: String,
    link: String,
    description: String,
    published: String,
    image: String,
    full_article: String,
    summary: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },

  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
