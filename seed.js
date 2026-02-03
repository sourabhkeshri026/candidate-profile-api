const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/candidate_profiles';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  education: { type: String, required: true },
  skills: [{ title: String, description: String, links: [String] }],
  projects: [{ title: String, description: String, links: [String] }],
  workLinks: { github: String, linkedin: String, portfolio: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

const sampleProfiles = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    education: "B.Tech in Computer Science",
    skills: [
      { title: "Python", description: "Backend development", links: [] },
      { title: "MongoDB", description: "Database management", links: [] }
    ],
    projects: [
      { title: "AI Chatbot", description: "Customer service bot", links: ["https://github.com/alice/chatbot"] }
    ],
    workLinks: {
      github: "https://github.com/alicejohnson",
      linkedin: "https://linkedin.com/in/alicejohnson",
      portfolio: "https://alicejohnson.dev"
    }
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    education: "MS in Software Engineering",
    skills: [
      { title: "React", description: "Frontend development", links: [] },
      { title: "Node.js", description: "Backend API", links: [] }
    ],
    projects: [
      { title: "E-commerce Platform", description: "Online shopping", links: ["https://github.com/bob/ecommerce"] }
    ],
    workLinks: {
      github: "https://github.com/bobsmith",
      linkedin: "https://linkedin.com/in/bobsmith",
      portfolio: "https://bobsmith.io"
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Candidate.deleteMany({});
    console.log('🗑️  Cleared existing profiles');

    const result = await Candidate.insertMany(sampleProfiles);
    console.log(`✅ Successfully seeded ${result.length} profiles`);

    console.log('\n📊 Seeded Profiles:');
    result.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.name} - ID: ${profile._id}`);
    });

    console.log('\n🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}

seedDatabase();