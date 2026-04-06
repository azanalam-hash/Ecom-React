// Load environment variables early
require('dotenv').config();
const http = require('http');
const db = require('./database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
db.connectToServer().then(() => {

  // Create the raw HTTP server
  const server = http.createServer(async (req, res) => {
    
    // -------------------------------------------------------------
    // CORS Handling (Cross-Origin Resource Sharing)
    // -------------------------------------------------------------
    // This allows our React app (running on localhost:5173) to communicate 
    // with this Node server (running on localhost:5000).
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for dev
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight (OPTIONS) requests automatically sent by browsers
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // -------------------------------------------------------------
    // Helper function to read the request body
    // -------------------------------------------------------------
    const getRequestBody = (request) => {
      return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => {
          body += chunk.toString(); // Append the string version of the data chunk
        });
        request.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch (error) {
            reject(error);
          }
        });
      });
    };

    // -------------------------------------------------------------
    // ROUTING LOGIC (No Express router)
    // -------------------------------------------------------------
    const urlParts = req.url.split('?');
    const path = urlParts[0];

    const database = db.getDb();
    const productsCollection = database.collection('products');

    // GET: Fetch all products
    if (req.method === 'GET' && path === '/api/products') {
      try {
        // Fetch all documents from the "products" collection in an array
        const products = await productsCollection.find({}).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Error fetching products", error: error.message }));
      }
    } 
    // POST: Create a new product (Admin route)
    else if (req.method === 'POST' && path === '/api/products') {
      try {
        const productData = await getRequestBody(req);
        
        // Ensure there is data
        if (!productData.name || !productData.price) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: "Name and Price are required" }));
          return;
        }

        // Insert into MongoDB
        const result = await productsCollection.insertOne(productData);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Product created successfully", id: result.insertedId }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Error creating product", error: error.message }));
      }
    } 
    // ROUTE NOT FOUND
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Route not found" }));
    }

  });

  // Start listening for inbound requests
  server.listen(PORT, () => {
    console.log(`🚀 Server running in RAW NODE JS mode on http://localhost:${PORT}`);
  });

});
