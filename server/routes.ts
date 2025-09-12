import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema, insertResumeSchema, insertAtsAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser({
        ...userData,
        id: req.body.id // Firebase UID
      });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Create user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Update user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id/analytics", async (req, res) => {
    try {
      const analytics = await storage.getUserAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      console.error("Get user analytics error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resume routes
  app.get("/api/resumes", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      const resumes = await storage.getUserResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Get resumes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Get resume error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    try {
      const resumeData = insertResumeSchema.parse(req.body);
      const resume = await storage.createResume(resumeData);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      console.error("Create resume error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/resumes/:id", async (req, res) => {
    try {
      const updates = insertResumeSchema.partial().parse(req.body);
      const resume = await storage.updateResume(req.params.id, updates);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      console.error("Update resume error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const success = await storage.deleteResume(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete resume error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/resumes/:id/duplicate", async (req, res) => {
    try {
      const originalResume = await storage.getResume(req.params.id);
      if (!originalResume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const duplicateData = {
        ...originalResume,
        title: `${originalResume.title} (Copy)`,
        atsScore: null,
        atsAttempts: 0,
      };
      delete (duplicateData as any).id;
      delete (duplicateData as any).createdAt;
      delete (duplicateData as any).updatedAt;

      const duplicate = await storage.createResume(duplicateData as InsertResume);
      res.status(201).json(duplicate);
    } catch (error) {
      console.error("Duplicate resume error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ATS Analysis routes
  app.get("/api/ats-analyses", async (req, res) => {
    try {
      const resumeId = req.query.resumeId as string;
      if (!resumeId) {
        return res.status(400).json({ message: "resumeId is required" });
      }
      const analyses = await storage.getResumeAtsHistory(resumeId);
      res.json(analyses);
    } catch (error) {
      console.error("Get ATS analyses error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ats-analyses", async (req, res) => {
    try {
      const analysisData = insertAtsAnalysisSchema.parse(req.body);
      
      // Check if resume exists and user has attempts remaining
      const resume = await storage.getResume(analysisData.resumeId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if ((resume.atsAttempts || 0) >= 5) {
        return res.status(400).json({ message: "Maximum ATS analysis attempts reached" });
      }

      const analysis = await storage.createAtsAnalysis(analysisData);
      
      // Update resume with new ATS score and increment attempts
      await storage.updateResume(analysisData.resumeId, {
        atsScore: analysisData.score,
        atsAttempts: (resume.atsAttempts || 0) + 1,
      });

      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analysis data", errors: error.errors });
      }
      console.error("Create ATS analysis error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search and filtering routes
  app.get("/api/resumes/search", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const searchTerm = req.query.q as string;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required" });
      }

      const resumes = await storage.searchResumes(userId, searchTerm);
      res.json(resumes);
    } catch (error) {
      console.error("Search resumes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/templates/:templateId/resumes", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const templateId = req.params.templateId;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const resumes = await storage.getResumesByTemplate(userId, templateId);
      res.json(resumes);
    } catch (error) {
      console.error("Get resumes by template error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
