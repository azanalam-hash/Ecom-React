const { MongoClient, ServerApiVersion } = require('mongodb');

// Get the connection string from our .env file
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbConnection;

module.exports = {
  // Function to establish connection
  connectToServer: async function () {
    try {
      await client.connect();
      // Select the database "ecommerce" (it will be created if it doesn't exist)
      dbConnection = client.db("ecommerce");
      console.log("✅ Successfully connected to MongoDB.");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1); // Stop server if DB totally fails
    }
  },

  // Function to get the connected database instance
  getDb: function () {
    return dbConnection;
  }
};
