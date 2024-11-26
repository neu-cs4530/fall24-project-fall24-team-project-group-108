const { MongoClient } = require("mongodb");

// MongoDB connection URI and database/collection names
const uri = "mongodb://localhost:27017/fake_so";
const databaseName = "fake_so";
const collectionName = "Badge";

// Hardcoded badge data
const badgeData = [
  { name: "Helper", description: "Answer 5 questions.", category: "answers", targetValue: 5, tier: "bronze", users: [] },
  { name: "Guide", description: "Answer 15 questions.", category: "answers", targetValue: 15, tier: "silver", users: [] },
  { name: "Sage", description: "Answer 25 questions.", category: "answers", targetValue: 25, tier: "gold", users: [] },
  { name: "Curious", description: "Ask 5 questions.", category: "questions", targetValue: 5, tier: "bronze", users: [] },
  { name: "Inquirer", description: "Ask 10 questions.", category: "questions", targetValue: 15, tier: "silver", users: [] },
  { name: "Investigator", description: "Ask 25 questions.", category: "questions", targetValue: 25, tier: "gold", users: [] },
  { name: "Observer", description: "Leave 5 comments.", category: "comments", targetValue: 5, tier: "bronze", users: [] },
  { name: "Commentator", description: "Leave 10 comments.", category: "comments", targetValue: 10, tier: "silver", users: [] },
  { name: "Debater", description: "Leave 20 comments.", category: "comments", targetValue: 20, tier: "gold", users: [] },
  { name: "Voter", description: "Cast 5 votes", category: "votes", targetValue: 5, tier: "bronze", users: [] },
  { name: "Critic", description: "Cast 10 votes", category: "votes", targetValue: 10, tier: "silver", users: [] },
  { name: "Curator", description: "Cast 25 votes", category: "votes", targetValue: 25, tier: "gold", users: [] },
];

// Function to seed the database
async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({}); // Clears the collection to avoid duplicate entries

    const result = await collection.insertMany(badgeData);

  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

// Run the seeding function
seedDatabase();
