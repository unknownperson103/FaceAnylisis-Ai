import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as faceapi from "face-api.js";
import { FaceAnalysisData, FaceFeatureAnalysis, FaceRating, FaceRecommendation } from "@shared/schema";
import { randomUUID } from "crypto";

// Default analyses and recommendations
const DEFAULT_FEATURES: FaceFeatureAnalysis[] = [
  { label: "Canthal Tilt", value: "Neutral" },
  { label: "Eye Shape", value: "Almond Eyes" },
  { label: "Eye Type", value: "Hunter" },
  { label: "Face Shape", value: "Heart" },
  { label: "Maxilla Development", value: "Neutral" },
  { label: "Nose Shape", value: "Roman or Aquiline Nose" },
];

const DEFAULT_RATINGS: FaceRating[] = [
  { category: "Overall", score: 80, percentage: 80 },
  { category: "Potential", score: 87, percentage: 87 },
  { category: "Jawline", score: 76, percentage: 76 },
  { category: "Cheekbones", score: 72, percentage: 72 },
  { category: "Skin quality", score: 82, percentage: 82 },
  { category: "Masculinity", score: 91, percentage: 91 },
];

const DEFAULT_RECOMMENDATIONS: FaceRecommendation[] = [
  {
    id: 1,
    title: "Heart face styling",
    description: "Deciding the best hairstyle for you is largely based on your face shape.",
    icon: "heart",
    color: "yellow-500",
  },
  {
    id: 2,
    title: "Start a skincare routine",
    description: "Skincare routines are crucial for everybody. Nobody is above it, you should start today.",
    icon: "cloud",
    color: "blue-300",
  },
  {
    id: 3,
    title: "Strengthen your jaw",
    description: "Chewing and performing facial exercises will give you a much stronger jawline.",
    icon: "bar-chart",
    color: "orange-300",
  },
  {
    id: 4,
    title: "Groom your eyebrows",
    description: "",
    icon: "number",
    color: "gray-500",
  },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all face analyses for a user
  app.get("/api/analyses", async (req, res) => {
    try {
      // In a real app, we would get the user ID from the session
      const userId = 1;
      const analyses = await storage.getFaceAnalysesByUserId(userId);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  // Get a specific face analysis
  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getFaceAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Analyze a face image
  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ message: "No image data provided" });
      }
      
      // In a real app, we would:
      // 1. Process the image using face-api.js
      // 2. Generate actual meaningful analysis data
      // 3. Save the image, if needed
      
      // For this example, we'll use the default data
      const analysisData: FaceAnalysisData = {
        features: DEFAULT_FEATURES,
        ratings: DEFAULT_RATINGS,
        recommendations: DEFAULT_RECOMMENDATIONS,
      };
      
      // In a real app, we would get the user ID from the session
      const userId = 1;
      
      // Save the analysis to storage
      const analysis = await storage.createFaceAnalysis({
        userId,
        imageUrl: `facial-analysis-${randomUUID()}.jpg`,
        analysisData,
      });
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing face:", error);
      res.status(500).json({ message: "Failed to analyze face" });
    }
  });

  // Delete a face analysis
  app.delete("/api/analyses/:id", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const deleted = await storage.deleteFaceAnalysis(analysisId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      res.json({ message: "Analysis deleted successfully" });
    } catch (error) {
      console.error("Error deleting analysis:", error);
      res.status(500).json({ message: "Failed to delete analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
