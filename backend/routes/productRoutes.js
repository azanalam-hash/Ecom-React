const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../database');

// Create an Express Router instance strictly for product workflows
const router = express.Router();

/**
 * GET /api/products
 * Fetch all products from the database
 */
router.get('/', async (req, res) => {
  try {
    const database = db.getDb();
    const productsCollection = database.collection('products');
    
    let filterObject = {};

    // 1. Categories (e.g. ?categories=Travel,Office)
    if (req.query.categories) {
      const categoriesArray = req.query.categories.split(',');
      filterObject.category = { $in: categoriesArray };
    }

    // 2. Price Range (e.g. ?minPrice=10&maxPrice=50)
    if (req.query.minPrice || req.query.maxPrice) {
      filterObject.price = {};
      if (req.query.minPrice) filterObject.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filterObject.price.$lte = Number(req.query.maxPrice);
    }

    // 3. Search text (e.g. ?search=bag)
    if (req.query.search) {
      filterObject.name = { $regex: req.query.search, $options: 'i' };
    }

    // Prepare query
    let query = productsCollection.find(filterObject);

    // 4. Sorting
    if (req.query.sort) {
      if (req.query.sort === "low-high") query = query.sort({ price: 1 });
      if (req.query.sort === "high-low") query = query.sort({ price: -1 });
      if (req.query.sort === "name") query = query.sort({ name: 1 });
      if (req.query.sort === "rating") query = query.sort({ rating: -1 });
    }
    
    // Execute query
    const products = await query.toArray();
    res.status(200).json(products);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

/**
 * GET /api/products/:id
 * Fetch a single product by its unique ObjectId
 */
router.get('/:id', async (req, res) => {
  try {
    const database = db.getDb();
    const productsCollection = database.collection('products');
    
    const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

/**
 * POST /api/products
 * Admin-only route to create a new product
 */
router.post('/', async (req, res) => {
  try {
    const database = db.getDb();
    const productsCollection = database.collection('products');
    
    // Express strictly parses the request body for us into req.body!
    const productData = req.body;
    
    if (!productData.name || !productData.price) {
      return res.status(400).json({ message: "Name and Price are required" });
    }

    const result = await productsCollection.insertOne(productData);
    res.status(201).json({ message: "Product created successfully", id: result.insertedId });
    
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
});

/**
 * DELETE /api/products/:id
 * Admin-only route to delete a specific product
 */
router.delete('/:id', async (req, res) => {
  try {
    const database = db.getDb();
    const productsCollection = database.collection('products');
    
    const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

module.exports = router;
