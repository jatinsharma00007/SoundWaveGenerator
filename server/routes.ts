import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create assets directory structure
  const assetsDir = path.join(process.cwd(), 'assets');
  const audioDir = path.join(assetsDir, 'audio');
  const ambientDir = path.join(audioDir, 'ambient');

  // Ensure directories exist
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  if (!fs.existsSync(ambientDir)) {
    fs.mkdirSync(ambientDir, { recursive: true });
  }

  // Serve static assets
  app.use('/assets', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // API route for audio file metadata
  app.get('/api/audio-files', async (req, res) => {
    try {
      // Return empty array for now - frontend handles audio generation
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch audio files' });
    }
  });

  // API route to save generated audio file
  app.post('/api/audio-files', async (req, res) => {
    try {
      const { filename, category, description, usage, duration, fileSize, isLoop } = req.body;
      
      // Return success for now - frontend handles storage
      res.json({ 
        id: Date.now(), 
        filename, 
        category, 
        description, 
        usage, 
        duration, 
        fileSize, 
        isLoop: isLoop || false 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save audio file metadata' });
    }
  });

  // API route to export all audio files as zip
  app.get('/api/export-all', async (req, res) => {
    try {
      // This would implement zip creation and download
      // For now, just return success
      res.json({ message: 'Export functionality would be implemented here' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to export audio files' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
