const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/candidate_profiles';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Candidate Profile Schema
const candidateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  education: {
    type: String,
    required: true
  },
  skills: [{
    title: String,
    description: String,
    links: [String]
  }],
  projects: [{
    title: String,
    description: String,
    links: [String]
  }],
  workLinks: {
    github: String,
    linkedin: String,
    portfolio: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

candidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// API Routes Router
const apiRouter = express.Router();

// Health check endpoint (stays at root level)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// CREATE - Add new candidate profile
apiRouter.post('/profiles', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: candidate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating profile',
      error: error.message
    });
  }
});

// READ - Get all profiles
apiRouter.get('/profiles', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profiles',
      error: error.message
    });
  }
});

// READ - Get profile by ID
apiRouter.get('/profiles/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// UPDATE - Update profile
apiRouter.put('/profiles/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: candidate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// DELETE - Delete profile
apiRouter.delete('/profiles/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
});

// SEARCH - Search profiles by skill
apiRouter.get('/search/skill/:skill', async (req, res) => {
  try {
    const skill = req.params.skill;
    const candidates = await Candidate.find({
      'skills.title': { $regex: skill, $options: 'i' }
    });
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching profiles',
      error: error.message
    });
  }
});

// SEARCH - Search profiles by project
apiRouter.get('/search/project/:project', async (req, res) => {
  try {
    const project = req.params.project;
    const candidates = await Candidate.find({
      'projects.title': { $regex: project, $options: 'i' }
    });
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching profiles',
      error: error.message
    });
  }
});

// Mount API routes with /api prefix
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API Routes: http://localhost:${PORT}/api/profiles`);
});

module.exports = app;