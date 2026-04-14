require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

const mockData = [
  {
    fullName: "Alice Johnson",
    email: "alice@example.com",
    country: "USA",
    city: "New York",
    skills: ["React", "Express", "MongoDB"],
    salary: 85000,
    isActive: true,
    description: "Senior React Developer looking for remote work.",
    createdAt: new Date()
  },
  {
    fullName: "Bob Smith",
    email: "bob@example.com",
    country: "Canada",
    city: "Toronto",
    skills: ["Node.js", "Express", "MongoDB"],
    salary: 70000,
    isActive: false,
    description: "Backend engineer focused on highly scalable APIs.",
    createdAt: new Date()
  },
  {
    fullName: "Charlie Alam",
    email: "charlie@example.com",
    country: "UK",
    city: "London",
    skills: ["React", "Node.js"],
    salary: 60000,
    isActive: true,
    description: "Fullstack developer passionate about UI design.",
    createdAt: new Date()
  },
  {
    fullName: "Diana Prince",
    email: "diana@example.com",
    country: "USA",
    city: "Los Angeles",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    salary: 110000,
    isActive: true,
    description: "Lead MERN stack architect with 10 years experience.",
    createdAt: new Date()
  },
  {
    fullName: "Edward Azanalam",
    email: "edward@example.com",
    country: "Canada",
    city: "Vancouver",
    skills: ["React"],
    salary: 50000,
    isActive: true,
    description: "Junior frontend developer.",
    createdAt: new Date()
  }
];

async function seedDB() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB.");
    const db = client.db("ecommerce");
    
    // Insert mock data into megaForms collection
    const result = await db.collection("megaForms").insertMany(mockData);
    console.log(`✅ Successfully inserted ${result.insertedCount} mock records into 'megaForms'!`);
    
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
    console.log("🔌 Database connection closed.");
  }
}

seedDB();
