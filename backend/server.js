// Load environment variables early
require('dotenv').config();

// Require Express frameworks
const express = require('express');
const cors = require('cors');

// Import database and route modules
const db = require('./database');
const productRoutes = require('./routes/productRoutes');
const megaFormRoutes = require('./routes/megaFormRoutes');
const path = require('path');

// Initialize the Express web app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing instantly with zero manual logic
app.use(cors());
app.use(express.json());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Forward any requests going to /api/products into our dedicated router file
app.use('/api/products', productRoutes);

// Mega Form route
app.use('/api/mega-form', megaFormRoutes);

// Fallback Route for non-existent endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB before accepting connections
db.connectToServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 EXPRESS Server running smoothly on http://localhost:${PORT}`);
  });
});
