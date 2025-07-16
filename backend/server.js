const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Url = require('./models/urlShortner');
const validUrl = require("valid-url");
const cors = require('cors'); // ✅ Import cors


const app = express();
const PORT = 5000;

app.use(cors());


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
    console.error('Server Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Short code already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/shorten/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const urlDoc = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { accessCount: 1 }, updatedAt: Date.now() },
      { new: true }
    );
    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    res.json({
      id: urlDoc._id,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const urlDoc = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { accessCount: 1 }, updatedAt: Date.now() },
      { new: true }
    );
    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    res.redirect(urlDoc.url);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/shorten/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  const { url, newShortCode } = req.body;

  // Validate inputs
  if (url && !validUrl.isWebUri(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }
  if (newShortCode && !/^[a-zA-Z0-9]{6}$/.test(newShortCode)) {
    return res.status(400).json({ error: "Invalid short code format" });
  }

  try {
    //check whether the code is unique or not
    if (newShortCode) {
      const existingUrl = await Url.findOne({ shortCode: newShortCode });
      if (existingUrl && existingUrl.shortCode !== shortCode) {
        return res.status(400).json({ error: "Short code already exists" });
      }
    }
    const updateFields = { updatedAt: Date.now() };
    if (url) updateFields.url = url;
    if (newShortCode) updateFields.shortCode = newShortCode;

    const urlDoc = await Url.findOneAndUpdate({ shortCode }, updateFields, {
      new: true,
    });

    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      id: urlDoc._id,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/shorten/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const urlDoc = await Url.findOneAndDelete({ shortCode });
    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/stats/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    res.json({
      id: urlDoc._id,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
      accessCount: urlDoc.accessCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
