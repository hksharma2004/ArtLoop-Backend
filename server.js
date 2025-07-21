require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("backend working");
});

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  exposedHeaders: ['x-guest-id'],
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('👁️  Google Cloud Vision API ready.');
  console.log('🎨 Together AI image generation ready.');
});

module.exports = app;