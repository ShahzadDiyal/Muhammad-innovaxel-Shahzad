const express = require('express');
const mongoose = require('mongoose'); 

const app = express();
const PORT = 5000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/urlShortnerInnovaxel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));