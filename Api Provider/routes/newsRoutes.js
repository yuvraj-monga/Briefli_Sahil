import express from "express";
import Article from "../models/Article.js";
import Category from "../models/Category.js";

const router = express.Router();
//API structure using Routes (Express prvides this)

//Get functionality of API
router.get("/", async (req, res) => {
  try {
    const categoryName = req.query.category;
    let articles;

    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      articles = await Article.find({ category: category._id })
        .populate("category", "name")
        .sort({ published: 1 }); //Latest news sorted first
    } else {
      articles = await Article.find()
        .populate("category", "name")
        .sort({ published: 1 });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/:id/likes", async (req, res) => {
  try {
    const articleId = req.params.id;

    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.likes += 1;

    await article.save();

    res.json({ message: "Likes updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//POST functionality of API
router.post("/:id/views", async (req, res) => {
  try {
    const articleId = req.params.id;

    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.views += 1;

    await article.save();

    res.json({ message: "Views updated",article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
