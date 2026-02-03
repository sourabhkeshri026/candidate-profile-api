# Candidate Profile API - Track A

Backend API for managing candidate profiles with MongoDB.

## Features
- REST API with Express.js
- MongoDB database
- CRUD operations
- Search functionality
- Beautiful frontend UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup MongoDB Atlas (see below)

3. Update `.env` with MongoDB URI

4. Seed sample data:
```bash
npm run seed
```

5. Start server:
```bash
npm start
```

6. Open `index.html` in browser

## API Endpoints

- GET `/health` - Health check
- POST `/profiles` - Create profile
- GET `/profiles` - Get all profiles
- GET `/profiles/:id` - Get profile by ID
- PUT `/profiles/:id` - Update profile
- DELETE `/profiles/:id` - Delete profile
- GET `/search/skill/:skill` - Search by skill
- GET `/search/project/:project` - Search by project

## Author

**Your Name**
- GitHub: [Your GitHub]
- Resume: [Your Resume Link]

## Live Demo

- Frontend: [Add after deployment]
- Backend: [Add after deployment]
```

**PASTE** and **SAVE**

---

## ✅ CHECKPOINT: Your Folder Should Look Like This

In VS Code left sidebar, you should see:
```
CANDIDATE-PROFILE-API
  .env
  .gitignore
  index.html
  package.json
  README.md
  seed.js
  server.js