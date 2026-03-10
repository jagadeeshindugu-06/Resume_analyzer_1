import express from 'express';
import multer from 'multer';
// @ts-ignore
import pdfParse from 'pdf-parse';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Load skills dataset
const skillsData = JSON.parse(fs.readFileSync(path.resolve('./skills.json'), 'utf-8'));
const recommendationsData = JSON.parse(fs.readFileSync(path.resolve('./recommendations.json'), 'utf-8'));

// Helper function to extract skills from text
function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();
  
  for (const skill of skillsData) {
    // Use word boundaries to avoid partial matches (e.g., "it" matching inside "with")
    // Escape special characters in skill names like "C++" or "Node.js"
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundSkills.add(skill);
    }
  }
  
  return Array.from(foundSkills);
}

// API Endpoints
app.post('/api/upload_resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let resumeText = '';

    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    } else if (req.file.mimetype === 'text/plain') {
      resumeText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' });
    }

    // Clean up text (remove extra whitespace)
    resumeText = resumeText.replace(/\s+/g, ' ').trim();

    res.json({ resume_text: resumeText });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

app.post('/api/analyze', (req, res) => {
  try {
    const { resume_text, jobs } = req.body;

    if (!resume_text || !jobs || !Array.isArray(jobs)) {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    const resumeSkills = extractSkills(resume_text);
    const results = [];

    for (const job of jobs) {
      const jobSkills = extractSkills(job.description);
      
      // Compare skills
      const matchedSkills = jobSkills.filter(skill => resumeSkills.includes(skill));
      const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
      
      // Calculate match score
      const matchScore = jobSkills.length > 0 
        ? Math.round((matchedSkills.length / jobSkills.length) * 100) 
        : 0;

      // Generate recommendations
      const recommendations: Record<string, string[]> = {};
      for (const missing of missingSkills) {
        if (recommendationsData[missing]) {
          recommendations[missing] = recommendationsData[missing];
        } else {
          recommendations[missing] = [`Search online for ${missing} tutorials`];
        }
      }

      results.push({
        job_title: job.title,
        match_score: matchScore,
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        recommendations: recommendations
      });
    }

    res.json({ results });
  } catch (error) {
    console.error('Error analyzing skills:', error);
    res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
