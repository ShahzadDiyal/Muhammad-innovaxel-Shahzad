const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const { Url } = require("./models/urlShortner");
const validUrl = require("valid-url");
const app = express();
const PORT = 5000;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/urlShortnerInnovaxel", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }
  const shortCode = nanoid(6);
  try {
    const newUrl = new Url({ url, shortCode });
    await newUrl.save();
    res.status(201).json({
      id: newUrl._id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Short code already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));